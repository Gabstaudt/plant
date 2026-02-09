"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Fechar modal"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="w-full max-w-xl rounded-2xl bg-white border border-black/10 shadow-xl">
              {title && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                  <div className="text-base font-extrabold text-[var(--plant-graphite)]">
                    {title}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-black/60 hover:bg-black/5"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="px-5 py-5">{children}</div>

              {footer ? (
                <div className="px-5 py-4 border-t border-black/5">{footer}</div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
