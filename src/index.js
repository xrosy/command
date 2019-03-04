/* eslint-disable */

const { Command, Option } = require('commander');

function pad (str, width) {
    const len = Math.max(0, width - str.length);

    return str + Array(len + 1).join(' ');
}


Command.prototype.version = function (str, flags, description) {
    if (arguments.length === 0) return this._version;

    this._version = str;

    flags = flags || '-v, --version';

    var versionOption = new Option(flags, description || '输出版本号');

    this._versionOptionName = versionOption.long.substr(2) || 'version';

    this.options.push(versionOption);

    this.on('option:' + this._versionOptionName, function() {
      process.stdout.write(str + '\n');
      process.exit(0);
    });
    return this;
};


Command.prototype.optionHelp = function () {
    const width = this.padWidth();

    const options = this.options.map((option) => {
      const flag  = pad(option.flags, width);
      const desc  = option.description;
      const value = option.bool && option.defaultValue !== undefined ? ` (default: ${JSON.stringify(option.defaultValue)})` : '';

      return `${flag}    ${desc}${value}`
    });

    return options.concat([ `${pad('-h, --help', width)}    ` + '输出使用帮助' ]).join('\n');
};


Command.prototype.outputHelp = function(caller) {
  const callback = caller ? caller : (passthru) => passthru;
  const source = callback(this.helpInformation()).split('\n');
  const format = source.map((str)=>`  ${str}`)

  process.stdout.write(`\n${format.join('\n')}\n`);

  this.emit('--help');
};

Command.prototype.missingArgument = function(name) {
  console.error("错误: 缺少必需的参数 `%s'", name);
  process.exit(1);
};


module.exports = new Command();
