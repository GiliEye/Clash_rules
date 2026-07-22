function main(config) {
  try {
    // 1. 初始化并插入 Rule Providers (规则集)
    config['rule-providers'] = config['rule-providers'] || {};
    
    // 优化：移除了 rule-providers 不支持的 health-check 字段，保持内核日志干净
    Object.assign(config['rule-providers'], {
      "EH-Rule": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "path": "./ruleset/custom/eh.list",
        "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/E-Hentai.list",
        "interval": 86400
      },
      "Proxy-Rule": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "path": "./ruleset/custom/add-proxies.list",
        "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/add-Proxies.list",
        "interval": 86400
      },
      "Direct-Rule": {
        "type": "http",
        "behavior": "classical",
        "format": "text",
        "path": "./ruleset/custom/add-direct.list",
        "url": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/add-Direct.list",
        "interval": 86400
      }
    });

    // 2. 初始化并插入策略组 E-Hentai
    config['proxy-groups'] = config['proxy-groups'] || [];
    
    const ehGroup = {
      "name": "E-Hentai",
      "type": "select",
      "include-all": true, 
      // 如果你想过滤特定地区的节点，可以取消下面这行的注释并修改正则：
      // "filter": "(?i)日|美|台|US|JP|TW",
      "proxies": ["Proxies", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/GiliEye/Clash_rules/main/ehviewer_icon.png"
    };

    // 优化：动态寻找插入位置，避免硬编码 20 导致可能的数组越界
    let targetIndex = config['proxy-groups'].findIndex(g => g.name === "Tiktok" || g.name === "TIKTOK");
    if (targetIndex !== -1) {
      // 如果找到了 Tiktok 分组，就把 E-Hentai 插在它后面
      config['proxy-groups'].splice(targetIndex + 1, 0, ehGroup);
    } else {
      // 如果没找到，稳妥起见插在第 2 个位置（通常紧随 GLOBAL 等全局分组之后）
      config['proxy-groups'].splice(2, 0, ehGroup); 
    }

    // 3. 初始化并插入路由规则
    config['rules'] = config['rules'] || [];
    
    // 优化：unshift 是对的，确保自定义规则优先级最高
    config['rules'].unshift(
      "RULE-SET,Direct-Rule,DIRECT",
      "RULE-SET,EH-Rule,E-Hentai",
      "RULE-SET,Proxy-Rule,Proxies"
    );

    return config;
    
  } catch (err) {
    // 容错：一旦脚本内部发生任何意外错误，记录错误并返回原始配置，防止代理直接崩溃断网
    console.error("Clash Verge 自定义脚本执行异常:", err);
    return config;
  }
}
