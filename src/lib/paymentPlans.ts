export type PlanCode = "auto_49" | "vip_99";

export const PLAN_CONFIG: Record<
  PlanCode,
  { amount: number; name: string; successRedirectPath: string }
> = {
  auto_49: {
    amount: 49.9,
    name: "稳定安装引导服务",
    successRedirectPath: "/install",
  },
  vip_99: {
    amount: 199,
    name: "一对一代办服务",
    successRedirectPath: "/contact",
  },
};

export function isPlanCode(input: string): input is PlanCode {
  return input === "auto_49" || input === "vip_99";
}
