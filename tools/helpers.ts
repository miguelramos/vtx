export const getCommandArguments = () => {
  return process.argv.slice(2).reduce((acc, arg) => {

    let [key, value = true] = arg.split('=');
    acc[key] = value === undefined ?
      true :
      /true|false/.test(value as string) ?
        value === 'true' :
        /[\d|\.]+/.test(value as string) ?
          Number(value) :
          value;
    return acc

  }, {});
};
