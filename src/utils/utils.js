
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

/**
 * url参数相关
 */
/*
export function parseParameter(url) {
  if (!url) url = window.location.href;
  var reg_url = /^[^\?]+\?([\w\W]+)$/,
    reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
    arr_url = reg_url.exec(url),
    ret = {};
  if (arr_url && arr_url[1]) {
    var str_para = arr_url[1],
      result;
    while ((result = reg_para.exec(str_para)) != null) {
      ret[result[1]] = result[2];
    }
  }
  return ret;
}*/
export function parseParameter (url) {
  var uri = url || window.location.href
  var match = uri && uri.match(/([^?=&@]+)=([^?&@]+)/g)
  return match && match.reduce(function(a, b){
    var val = b.split(/([^?=&@]+)=([^?&@]+)/g)
    a[val[1]] = val[2]
    return a
  }, {}) || {}
}
export function getUrlParams (url) {
  var uri = url || window.location.href
  var match = uri && uri.match(/([^?=&]+)=([^?&]+)/g)

  return match && match.reduce(function(a, b){
    var val = b.split(/([^?=&]+)=([^?&]+)/g)
    a[val[1]] = val[2]
    return a
  }, {})
}

export function compositingParameter(parameter) {
  if (!parameter) return "";
  if (parameter && parameter.constructor != Object) return "";
  if (JSON.stringify(parameter) == "{}") return "";

  let parameterKeys = Object.keys(parameter),
    parameterValues = Object.values(parameter),
    parameterText = "";

  for (let i = 0; i < parameterKeys.length; i++) {
    if (parameterValues[i] || parameterValues[i] == 0) {
      parameterText += `${parameterKeys[i]}=${parameterValues[i]}${i <
      parameterKeys.length - 1
        ? "&"
        : ""}`;
    }
  }

  if (parameterText) {
    parameterText = `?${parameterText}`;
    return parameterText;
  } else {
    return "";
  }
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function isUrl(string) {
  var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
  var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
  var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

  if (typeof string !== 'string') {
    return false;
  }

  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
      nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}



