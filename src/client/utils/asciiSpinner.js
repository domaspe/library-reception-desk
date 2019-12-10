// https://raw.githubusercontent.com/sindresorhus/cli-spinners/master/spinners.json
const frames = ['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙∙∙'];

export default function create() {
  let frame = 0;
  return () => {
    // eslint-disable-next-line no-plusplus
    return frames[++frame % frames.length];
  };
}
