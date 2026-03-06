#!/usr/bin/env bash

set -uo pipefail

APP_NAME="openclaw-installer"
OPENCLAW_DIR_DEFAULT="${HOME}/openclaw"
CONFIG_DIR="${HOME}/.openclaw"
CONFIG_FILE="${CONFIG_DIR}/openclaw.json"
LOG_DIR="${HOME}/.openclaw-installer"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
REPORT_TXT=""
REPORT_JSON=""

CHECK_LINES=()
LAST_REPORT_TXT_FILE=""
LAST_REPORT_JSON_FILE=""

ensure_log_dir() {
  if mkdir -p "${LOG_DIR}" >/dev/null 2>&1; then
    :
  else
    LOG_DIR="/tmp/.openclaw-installer"
    mkdir -p "${LOG_DIR}"
  fi
  REPORT_TXT="${LOG_DIR}/report-${TIMESTAMP}.txt"
  REPORT_JSON="${LOG_DIR}/report-${TIMESTAMP}.json"
}

print_usage() {
  cat <<EOF
Usage:
  ${APP_NAME} doctor
  ${APP_NAME} install [--dir <path>]
  ${APP_NAME} config --api-key <key> [--provider <name>] [--base-url <url>] [--model <id>]
  ${APP_NAME} verify [--dir <path>]
  ${APP_NAME} report

Examples:
  ${APP_NAME} doctor
  ${APP_NAME} install --dir "${HOME}/openclaw"
  ${APP_NAME} config --api-key "sk-xxxx" --provider "gmn" --base-url "https://gmncode.cn/v1"
  ${APP_NAME} verify
EOF
}

escape_json() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf "%s" "${value}"
}

add_check() {
  local name="$1"
  local status="$2"
  local message="$3"
  local fix="${4:-}"
  CHECK_LINES+=("${name}|${status}|${message}|${fix}")
}

check_command() {
  local cmd="$1"
  local fix="$2"
  if command -v "${cmd}" >/dev/null 2>&1; then
    add_check "${cmd}" "PASS" "$(command -v "${cmd}")"
    return 0
  fi
  add_check "${cmd}" "FAIL" "${cmd} not found" "${fix}"
  return 1
}

write_report() {
  local title="$1"
  local status="PASS"
  local line
  local idx=0

  ensure_log_dir

  for line in "${CHECK_LINES[@]}"; do
    IFS="|" read -r _name _state _message _fix <<<"${line}"
    if [[ "${_state}" == "FAIL" ]]; then
      status="FAIL"
      break
    fi
  done

  {
    echo "=== ${title} (${TIMESTAMP}) ==="
    echo "Overall: ${status}"
    echo ""
    for line in "${CHECK_LINES[@]}"; do
      IFS="|" read -r name state message fix <<<"${line}"
      echo "- [${state}] ${name}: ${message}"
      if [[ -n "${fix}" ]]; then
        echo "  Fix: ${fix}"
      fi
    done
  } >"${REPORT_TXT}"

  {
    echo "{"
    echo "  \"title\": \"$(escape_json "${title}")\","
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"overall\": \"${status}\","
    echo "  \"checks\": ["
    for line in "${CHECK_LINES[@]}"; do
      IFS="|" read -r name state message fix <<<"${line}"
      idx=$((idx + 1))
      echo "    {"
      echo "      \"name\": \"$(escape_json "${name}")\","
      echo "      \"status\": \"${state}\","
      echo "      \"message\": \"$(escape_json "${message}")\","
      echo "      \"fix\": \"$(escape_json "${fix}")\""
      if [[ "${idx}" -lt "${#CHECK_LINES[@]}" ]]; then
        echo "    },"
      else
        echo "    }"
      fi
    done
    echo "  ]"
    echo "}"
  } >"${REPORT_JSON}"

  LAST_REPORT_TXT_FILE="${REPORT_TXT}"
  LAST_REPORT_JSON_FILE="${REPORT_JSON}"

  echo "Report TXT: ${REPORT_TXT}"
  echo "Report JSON: ${REPORT_JSON}"
}

doctor() {
  CHECK_LINES=()
  add_check "os" "PASS" "$(uname -s) $(uname -m)"

  check_command "node" "Install Node.js LTS first (https://nodejs.org)" || true
  check_command "npm" "npm should be installed together with Node.js" || true
  check_command "git" "Install Git first (https://git-scm.com)" || true
  check_command "curl" "Install curl or use a network-enabled shell" || true

  if curl -Is --max-time 8 https://github.com >/dev/null 2>&1; then
    add_check "network_github" "PASS" "github.com reachable"
  else
    add_check "network_github" "FAIL" "github.com unreachable" "Check proxy/VPN or network settings"
  fi

  if curl -Is --max-time 8 https://registry.npmjs.org >/dev/null 2>&1; then
    add_check "network_npm" "PASS" "registry.npmjs.org reachable"
  else
    add_check "network_npm" "FAIL" "registry.npmjs.org unreachable" "Try: npm config set registry https://registry.npmmirror.com"
  fi

  write_report "doctor"
}

install_openclaw() {
  local target_dir="${OPENCLAW_DIR_DEFAULT}"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dir)
        target_dir="$2"
        shift 2
        ;;
      *)
        echo "Unknown option: $1"
        print_usage
        return 1
        ;;
    esac
  done

  CHECK_LINES=()
  add_check "target_dir" "PASS" "${target_dir}"

  check_command "node" "Install Node.js LTS first (https://nodejs.org)" || true
  check_command "npm" "Install npm with Node.js" || true
  check_command "git" "Install Git first (https://git-scm.com)" || true

  if [[ "${#CHECK_LINES[@]}" -gt 0 ]]; then
    local line
    for line in "${CHECK_LINES[@]}"; do
      IFS="|" read -r _name _state _message _fix <<<"${line}"
      if [[ "${_state}" == "FAIL" ]]; then
        write_report "install-precheck"
        return 1
      fi
    done
  fi

  if [[ -d "${target_dir}/.git" ]]; then
    if git -C "${target_dir}" pull --ff-only >/dev/null 2>&1; then
      add_check "git_pull" "PASS" "Updated existing repository"
    else
      add_check "git_pull" "FAIL" "Failed to update repository" "Run: git -C \"${target_dir}\" pull --ff-only"
    fi
  else
    if git clone https://github.com/openclaw/openclaw.git "${target_dir}" >/dev/null 2>&1; then
      add_check "git_clone" "PASS" "Cloned openclaw into ${target_dir}"
    else
      add_check "git_clone" "FAIL" "Failed to clone repository" "Check network, then run: git clone https://github.com/openclaw/openclaw.git \"${target_dir}\""
      write_report "install"
      return 1
    fi
  fi

  if (cd "${target_dir}" && npm install >/dev/null 2>&1); then
    add_check "npm_install" "PASS" "Dependencies installed"
  else
    add_check "npm_install" "FAIL" "npm install failed" "Try: cd \"${target_dir}\" && npm config set registry https://registry.npmmirror.com && npm install"
  fi

  write_report "install"
}

config_openclaw() {
  local api_key=""
  local provider="gmn"
  local base_url="https://gmncode.cn/v1"
  local model="gpt-5.3-codex"
  local backup_file=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --api-key)
        api_key="$2"
        shift 2
        ;;
      --provider)
        provider="$2"
        shift 2
        ;;
      --base-url)
        base_url="$2"
        shift 2
        ;;
      --model)
        model="$2"
        shift 2
        ;;
      *)
        echo "Unknown option: $1"
        print_usage
        return 1
        ;;
    esac
  done

  if [[ -z "${api_key}" ]]; then
    echo "Missing required argument: --api-key"
    return 1
  fi

  CHECK_LINES=()
  mkdir -p "${CONFIG_DIR}"

  if [[ -f "${CONFIG_FILE}" ]]; then
    backup_file="${CONFIG_FILE}.bak-${TIMESTAMP}"
    cp "${CONFIG_FILE}" "${backup_file}"
    add_check "backup_config" "PASS" "${backup_file}"
  else
    add_check "backup_config" "PASS" "No existing config, skip backup"
  fi

  cat >"${CONFIG_FILE}" <<EOF
{
  "models": {
    "providers": {
      "${provider}": {
        "baseUrl": "${base_url}",
        "apiKey": "${api_key}",
        "auth": "api-key",
        "api": "openai-responses",
        "authHeader": true,
        "models": [
          {
            "id": "${model}",
            "name": "${model}"
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "${provider}/${model}"
      }
    }
  }
}
EOF

  if [[ -s "${CONFIG_FILE}" ]]; then
    add_check "write_config" "PASS" "${CONFIG_FILE}"
  else
    add_check "write_config" "FAIL" "Failed to write config file" "Check directory permissions: ${CONFIG_DIR}"
  fi

  write_report "config"
}

verify() {
  local target_dir="${OPENCLAW_DIR_DEFAULT}"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dir)
        target_dir="$2"
        shift 2
        ;;
      *)
        echo "Unknown option: $1"
        print_usage
        return 1
        ;;
    esac
  done

  CHECK_LINES=()

  if command -v node >/dev/null 2>&1; then
    add_check "node_version" "PASS" "$(node --version)"
  else
    add_check "node_version" "FAIL" "Node.js missing" "Install Node.js LTS first"
  fi

  if command -v npm >/dev/null 2>&1; then
    add_check "npm_version" "PASS" "$(npm --version)"
  else
    add_check "npm_version" "FAIL" "npm missing" "Install npm with Node.js"
  fi

  if [[ -d "${target_dir}" ]]; then
    add_check "openclaw_dir" "PASS" "${target_dir}"
  else
    add_check "openclaw_dir" "FAIL" "OpenClaw directory not found" "Run: ${APP_NAME} install --dir \"${target_dir}\""
  fi

  if [[ -d "${target_dir}/node_modules" ]]; then
    add_check "dependencies" "PASS" "node_modules exists"
  else
    add_check "dependencies" "FAIL" "Dependencies not found" "Run: cd \"${target_dir}\" && npm install"
  fi

  if [[ -f "${CONFIG_FILE}" ]]; then
    add_check "config_file" "PASS" "${CONFIG_FILE}"
  else
    add_check "config_file" "FAIL" "Config file missing" "Run: ${APP_NAME} config --api-key <your_key>"
  fi

  write_report "verify"
}

report() {
  local latest_txt=""
  local latest_json=""
  ensure_log_dir
  latest_txt="$(ls -1t "${LOG_DIR}"/report-*.txt 2>/dev/null | head -n 1 || true)"
  latest_json="$(ls -1t "${LOG_DIR}"/report-*.json 2>/dev/null | head -n 1 || true)"

  if [[ -z "${latest_txt}" && -z "${latest_json}" ]]; then
    echo "No report found in ${LOG_DIR}"
    return 1
  fi

  echo "Latest TXT: ${latest_txt}"
  echo "Latest JSON: ${latest_json}"
}

main() {
  local cmd="${1:-}"
  shift || true

  case "${cmd}" in
    doctor)
      doctor "$@"
      ;;
    install)
      install_openclaw "$@"
      ;;
    config)
      config_openclaw "$@"
      ;;
    verify)
      verify "$@"
      ;;
    report)
      report "$@"
      ;;
    ""|-h|--help|help)
      print_usage
      ;;
    *)
      echo "Unknown command: ${cmd}"
      print_usage
      return 1
      ;;
  esac
}

main "$@"
