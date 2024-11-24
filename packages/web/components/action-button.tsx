import { isLoadingState, ScreenState } from '@/types/screen-state';
import { Loader2 } from 'lucide-react';

export const ActionButton = ({
  screenState,
  onClick,
}: {
  screenState: ScreenState;
  onClick: () => void;
}) => {
  return (
    <button
      className="bg-dark-brand text-background hover:opacity-70 w-full py-3 rounded-xl mt-2 font-[family-name:var(--font-geist-mono)] uppercase text-sm flex flex-row items-center justify-center disabled:opacity-50"
      onClick={onClick}
      disabled={isLoadingState(screenState)}>
      {isLoadingState(screenState) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {screenState === ScreenState.SELECTING_IMAGE && 'Extract dates'}
      {screenState === ScreenState.IMAGE_UPLOADING && 'Uploading...'}
      {screenState === ScreenState.IMAGE_PROCESSING && 'Processing...'}
      {(screenState === ScreenState.ERROR ||
        screenState === ScreenState.IMAGE_PROCESSED) &&
        `Let's do it again!`}
    </button>
  );
};
