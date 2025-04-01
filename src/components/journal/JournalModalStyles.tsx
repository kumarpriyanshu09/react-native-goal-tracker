
import React from 'react';

export function JournalModalStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        [data-radix-sheet-content] [data-radix-sheet-close] {
          display: none !important;
        }
      `
    }} />
  );
}
