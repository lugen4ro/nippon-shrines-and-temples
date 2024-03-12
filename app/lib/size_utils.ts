// Convert rem values to pixel values
export function remToPx(rem: number) {
    return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
}
