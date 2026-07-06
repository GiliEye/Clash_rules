function main(config) {
  // 1. 初始化并插入 Rule Providers (规则集)
  if (!config['rule-providers']) {
    config['rule-providers'] = {};
  }
  Object.assign(config['rule-providers'], {
    "EH-Rule": {
      "type": "http",
      "behavior": "classical",
      "format": "text",
      "path": "./ruleset/custom/eh.list",
      "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/E-Hentai.list",
      "interval": 86400,
      "health-check": { "enable": true, "url": "https://www.gstatic.com/generate_204", "interval": 600 }
    },
    "Proxy-Rule": {
      "type": "http",
      "behavior": "classical",
      "format": "text",
      "path": "./ruleset/custom/add-proxies.list",
      "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/add-Proxies.list",
      "interval": 86400,
      "health-check": { "enable": true, "url": "https://www.gstatic.com/generate_204", "interval": 600 }
    },
    "Direct-Rule": {
      "type": "http",
      "behavior": "classical",
      "format": "text",
      "path": "./ruleset/custom/add-direct.list",
      "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/add-Direct.list",
      "interval": 86400,
      "health-check": { "enable": true, "url": "https://www.gstatic.com/generate_204", "interval": 600 }
    }
  });

  // 2. 初始化并插入策略组 E-Hentai
  if (!config['proxy-groups']) {
    config['proxy-groups'] = [];
  }
  // 使用 unshift 将新建的分组插到数组的最前面，使用 push 显示在最后面，精确地放在比如“第 3 个”位置 splice(2, 0, { "name" 因为计算机从 0 开始计数
  config['proxy-groups'].splice(20, 0, {
    "name": "E-Hentai",
    "type": "select",
    "include-all": true, // 自动抓取机场的所有节点
    "proxies": ["Proxies", "DIRECT"],
    "icon": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/ehviewer_icon.png"
  });

  // 3. 初始化并插入路由规则
  if (!config['rules']) {
    config['rules'] = [];
  }
  // 使用 unshift 将自定义规则插到规则列表的最顶部，确保优先级最高
  config['rules'].unshift(
    "RULE-SET,Direct-Rule,DIRECT",
    "RULE-SET,EH-Rule,E-Hentai",
    "RULE-SET,Proxy-Rule,Proxies"
  );

  return config;
}
