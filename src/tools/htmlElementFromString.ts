export const createHTMLElementFromString = (htmlString: string): HTMLElement => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild as HTMLElement;
};