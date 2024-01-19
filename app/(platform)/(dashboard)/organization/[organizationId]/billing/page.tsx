import { checkSubsription } from "@/lib/subscription"
import { Info } from "../../../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubscriptonButton } from "./_components/subscription-button";



const BillingPage = async () => {
    const isPro = await checkSubsription();
    return (
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-2" />
            <SubscriptonButton isPro={isPro} />
        </div>
    );
};

export default BillingPage;