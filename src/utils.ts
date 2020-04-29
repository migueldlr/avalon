export const listify = (l: string[]) => {
    if (l.length === 1) return l[0];
    if (l.length === 2) return l.join(' and ');
    const first = l.slice(0, -1).join(', ');
    return `${first}, and ${l[l.length - 1]}`;
};
