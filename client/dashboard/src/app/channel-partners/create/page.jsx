import ChannelPartnerForm from "@/components/forms/channel-partner-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading
        title={"Create Channel Partner"}
        description="Create Channel Partner."
      />
      <ChannelPartnerForm type="create" />
    </PageContainer>
  );
}
