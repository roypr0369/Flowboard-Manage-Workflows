'use client';

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
    const proModal = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onClick = () => {
        execute ({
    
        });
    }
    
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent 
            className="max-w-xl p-0 overflow-hidden"
            >
                <div 
                className="aspect-video relative flex items-center justify-center"
                >
                    <Image src="/hero.svg"
                    alt="Hero"
                    className="object-cover"
                    fill />

                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2>
                        Upgrade to Flowboard Pro Today!
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600">
                       Explore the best of Flowboard  
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited boards</li>
                            <li>Advanced checklists</li>
                            <li>Admin and security features</li>
                            <li>And more</li>
                        </ul>
                    </div>
                    <Button disabled={isLoading}
                    onClick={onClick} className="w-full" variant="primary">
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
