export function xpathText(text: string, elementTag = '*') {
    // TODO: escaping
    return `//${elementTag}[contains(text(), '${text}')]`;
}
