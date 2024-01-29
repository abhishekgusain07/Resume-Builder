export const cx = (...classes: Array<string | boolean | undefined>) => {
    const newClasses: string[] = [];
    for (const c of classes) {
      if (typeof c === "string" && c.trim() !== "") {
        newClasses.push(c.trim());
      }
    }
  
    return newClasses.join(" ");
  };