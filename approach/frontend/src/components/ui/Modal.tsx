import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { cn } from '../../utils/cn';

interface ModalProps extends Dialog.DialogProps {
  children: React.ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Dialog.Root {...props}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content
            ref={ref}
            className={cn(
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg',
              'w-full max-w-md',
              'focus:outline-none',
              className
            )}
          >
            <FocusTrap>{children}</FocusTrap>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };