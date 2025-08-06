import { Plus, Share } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useA2HDetection } from "../hooks/use-a2h-detection";
import { useIconDetection } from "../hooks/use-icon-detection";
import { cn } from "../utils";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

export interface A2HDrawerProps {
  /** The name of your PWA application */
  appName?: string;
  /** Automatically detect and display app icons */
  autoDetectIcon?: boolean;
  /** Show demonstration video */
  showDemoVideo?: boolean;
  /** UI theme variant */
  theme?: "ios" | "material" | "custom";
  /** Custom icon URL (overrides auto-detection) */
  customIcon?: string;
  /** Callback when drawer is closed */
  onClose?: () => void;
  /** Callback when installation is triggered */
  onInstall?: () => void;
  /** Custom CSS class name */
  className?: string;
  /** Control drawer visibility externally */
  open?: boolean;
}

export const A2HDrawer: React.FC<A2HDrawerProps> = ({
  appName = "",
  autoDetectIcon = true,
  showDemoVideo = false,
  theme = "ios",
  customIcon,
  onClose,
  onInstall,
  className,
  open: controlledOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstallable, installPrompt, handleInstall } = useA2HDetection();
  const { appIcon, detectedAppName } = useIconDetection({
    autoDetect: autoDetectIcon,
    customIcon,
  });

  const finalAppName = appName || detectedAppName || "This App";
  const finalIcon = customIcon || appIcon;

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose?.();
    }
  };

  const handleInstallClick = async () => {
    await handleInstall();
    onInstall?.();
    setIsOpen(false);
  };

  return (
    <Drawer open={controlledOpen !== undefined ? controlledOpen : isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent
        className={cn(
          "max-w-sm mx-auto border-none",
          theme === "ios" &&
            "bg-white/25 backdrop-blur-[20px] border border-white/30 rounded-t-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
          theme === "material" && "bg-white/18 backdrop-blur-[16px] border border-white/20 rounded-t-2xl",
          className,
        )}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <DrawerHeader className="text-center px-6 pt-6">
          <div className="w-12 h-1.5 bg-foreground/20 rounded-full mx-auto mb-6" />
          <DrawerTitle
            className={cn(
              "text-xl font-semibold tracking-tight",
              theme === "ios" && "font-[system-ui] text-foreground/90",
            )}
          >
            Add to Home Screen
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-2">
            Install this app on your home screen for quick access
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-2">
          {/* App Info */}
          <div className="flex items-center space-x-4 mb-8">
            {finalIcon && (
              <div className="flex-shrink-0 relative">
                <div
                  className={cn(
                    "absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-white/5",
                    "backdrop-blur-sm border border-white/10",
                  )}
                />
                <img
                  src={finalIcon}
                  alt={`${finalAppName} icon`}
                  className={cn("relative w-20 h-20 object-cover", theme === "ios" ? "rounded-3xl" : "rounded-2xl")}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-foreground/90 truncate font-[system-ui]">{finalAppName}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Get instant access with a tap from your home screen
              </p>
            </div>
          </div>

          {/* Demo Video */}
          {showDemoVideo && (
            <div className="mb-8 rounded-3xl overflow-hidden bg-white/18 backdrop-blur-[16px] border border-white/20">
              <div className="aspect-video flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/18 backdrop-blur-[16px] border border-white/20 flex items-center justify-center mb-3 mx-auto">
                    <Share className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-medium">Demo video placeholder</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-white/18 backdrop-blur-[16px] border border-white/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Tap the <Share className="inline w-4 h-4 mx-1 text-primary" /> share button in your browser
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-white/18 backdrop-blur-[16px] border border-white/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Select <Plus className="inline w-4 h-4 mx-1 text-primary" /> "Add to Home Screen"
                </p>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="px-6 pb-8 pt-4">
          {isInstallable && installPrompt && (
            <Button
              onClick={handleInstallClick}
              className={cn(
                "w-full text-white font-semibold py-4 text-base bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-[10px] border border-white/30 transition-all duration-300 hover:from-white/30 hover:to-white/15 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                theme === "ios" && "rounded-3xl h-14",
              )}
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              Install App
            </Button>
          )}
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full text-muted-foreground hover:text-foreground transition-colors mt-2",
                theme === "ios" && "rounded-2xl h-12",
              )}
            >
              Not Now
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

A2HDrawer.displayName = "A2HDrawer";
