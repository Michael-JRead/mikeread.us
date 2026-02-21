import { useEffect, useState } from "react";

interface ManusDialogProps {
  title?: string;
  logo?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function ManusDialog({
  title,
  logo,
  open = false,
  onLogin,
  onOpenChange,
  onClose,
}: ManusDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (!onOpenChange) {
      setInternalOpen(open);
    }
  }, [open, onOpenChange]);

  const isOpen = onOpenChange ? open : internalOpen;

  const close = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalOpen(false);
    }
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm py-5 bg-slate-950 rounded-[20px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.35)] border border-red-900/50 backdrop-blur-2xl text-center">
        <div className="flex flex-col items-center gap-2 p-5 pt-8">
          {logo ? (
            <div className="w-16 h-16 bg-slate-900 rounded-xl border border-red-900/50 flex items-center justify-center">
              <img src={logo} alt="Dialog graphic" className="w-10 h-10 rounded-md" />
            </div>
          ) : null}

          {title ? (
            <h2 className="text-xl font-semibold text-slate-100 leading-[26px] tracking-[-0.44px]">
              {title}
            </h2>
          ) : null}
          <p className="text-sm text-slate-300 leading-5 tracking-[-0.154px]">
            Please login with Manus to continue
          </p>
        </div>

        <div className="px-5 py-5 space-y-3">
          <button
            type="button"
            onClick={onLogin}
            className="w-full h-10 bg-red-600 hover:bg-red-500 text-white rounded-[10px] text-sm font-medium leading-5 tracking-[-0.154px]"
          >
            Login with Manus
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-[10px] text-sm font-medium leading-5 tracking-[-0.154px] border border-red-900/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
