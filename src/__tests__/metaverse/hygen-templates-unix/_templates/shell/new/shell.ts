export function render(context: any) {
  return {
    sh: `mkdir -p ${context.cwd}/given/shell && touch ${context.cwd}/given/shell/${context.name}.hello`,
  }
}
