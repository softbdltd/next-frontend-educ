import {useCallback, useEffect} from 'react';

export default function useKeyboardCommand<T extends HTMLElement | Document>(
  command: string,
  handler: (key?: string) => void,
  element?: T,
) {
  const handleKeyDown = useCallback(
    (evt: Event | React.KeyboardEvent) => {
      const e = evt as KeyboardEvent;
      const isCtrlDown = e.metaKey || e.ctrlKey;
      const isShiftDown = e.shiftKey;
      const isAltDown = e.altKey;
      const keys = command.split('+');

      const triggered =
        keys.includes(e.key.toLowerCase().replace(/ctrl|shift|alt/, '')) &&
        keys.includes('ctrl') === isCtrlDown &&
        keys.includes('shift') === isShiftDown &&
        keys.includes('alt') === isAltDown;

      if (triggered) {
        if (keys.length > 1) {
          handler(keys[1]);
        } else {
          handler();
        }
        evt.preventDefault();
      }
    },
    [command, handler],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [element, handleKeyDown]);

  return handleKeyDown;
}
