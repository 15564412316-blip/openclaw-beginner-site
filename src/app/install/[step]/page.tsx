import { notFound } from "next/navigation";
import { InstallStepTemplate } from "@/components/install/InstallStepTemplate";
import { getInstallStep, INSTALL_STEPS } from "@/lib/installSteps";

type Props = {
  params: Promise<{ step: string }>;
};

export default async function InstallStepPage({ params }: Props) {
  const { step: slug } = await params;
  const step = getInstallStep(slug);
  if (!step) {
    notFound();
  }
  const index = INSTALL_STEPS.findIndex((s) => s.slug === slug);
  return <InstallStepTemplate step={step} index={index} total={INSTALL_STEPS.length} />;
}
