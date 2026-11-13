import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import LanguagesManager from "./_component/languages-manager";

export const metadata = {
  title: "Languages",
};

export default function LanguagesPage() {
  return (
    <PageContainer>
      <Heading
        title="Languages"
        description="Languages of every country site: which ones are live and which is the default."
      />
      <LanguagesManager />
    </PageContainer>
  );
}
