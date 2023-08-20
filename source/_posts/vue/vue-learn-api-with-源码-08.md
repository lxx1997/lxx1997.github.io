---
title: 跟着 Vue源码学习 Vue api 系列 (八) - 指令
date: 2021-02-01 17:29:54
updated: 2021-02-01 17:29:54
categories: 
    - [Vue]
    - [SourceCode]
tags:
    - Vue
    - SourceCode
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
---

#### 内置指令

Vue 内置了以下几种指令

* v-text
* v-html
* v-show
* v-if
* v-else
* v-else-if
* v-for
* v-on
* v-bind
* v-model
* v-slot
* v-pre
* v-cloak
* v-once

在源码中分为以下几种

~~~js
  // v-html v-text v-model
  var directives$1 = {
    model: model,
    text: text,
    html: html
  }
  // v-on v-bind v-clock
  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  };
  // v-if v-else v-else-if
  function processIf (el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }
  // v-pre
  function processPre (el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }
  // v-for v-slot
  function processFor (el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp),
          el.rawAttrsMap['v-for']
        );
      }
    }
  }
  // v-slot
  var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
  // v-once
  function processOnce (el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }
  // v-show
  if (child.data.directives && child.data.directives.some(isVShowDirective)) {
    child.data.show = true;
  }
~~~

#### v-text / v-html

~~~js
  // dir 为 directive 中的 binding 属性
  /**
    arg: null
    end: 18
    isDynamicArg: false
    modifiers: undefined
    name: "text"
    rawName: "v-text"
    start: 5
    value: "text"
  */
  function text (el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
    }
  }
  
  function html (el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
    }
  }
  // addProp (当前元素实例, 'textContent', '_s(dir.value)', dir, null)
  function addProp (el, name, value, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
    el.plain = false;
  }
  // rangeSetItem
  function rangeSetItem (item, range) {
    if (range) {
      if (range.start != null) {
        item.start = range.start;
      }
      if (range.end != null) {
        item.end = range.end;
      }
    }
    return item
  }
~~~
  `v-text` 指令在 `processAttrs` 函数中 通过 `addDirective` 方法 添加一个 `directive` 属性，然后 通过 `updateDOMProps` 方法中的 `elm[key] = cur` 为 元素的 `textContent` 或者 `innerHTML` 属性赋值

~~~html
  <div v-text="text"></div>
  <div v-html="text"></div>
~~~

注意：如果 v-text/v-html 指令所在的元素下的子元素，则不会被渲染

#### v-model

~~~js
  function model (el, dir, _warn) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1(
          "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
          "File inputs are read only. Use a v-on:change listener instead.",
          el.rawAttrsMap['v-model']
        );
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "v-model is not supported on this element type. " +
        'If you are working with contenteditable, it\'s recommended to ' +
        'wrap a library dedicated for that purpose inside a custom component.',
        el.rawAttrsMap['v-model']
      );
    }

    // ensure runtime directive metadata
    return true
  }
~~~

  v-model 指令主要针对于 input 输入框 及textarea 等需要输入或者状态变更的元素，`v-model` 相当于 `v-bind:value + v-on:change` 的组合体，在其他组件上不能使用 v-model

#### v-show

~~~js
  // ref
  // def: {bind: ƒ, update: ƒ, unbind: ƒ}
  // expression: "true"
  // modifiers: {}
  // name: "show"
  // rawName: "v-show"
  // value: true
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
      console.log(ref,value, transition$$1)
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },
~~~

取 `ref.value` 如果 `v-show="false"` 则 `ref.value` 为 false 将 元素的display 属性设置为 null

#### v-if/v-else/v-else-if

~~~js
  // 判断当前元素是否有 v-if，v-else， v-else-if 指令
  // 并将元素上的if,else,elseif 属性置为对应状态
  function processIf (el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  // 通过 addIfCondition 方法将 v-if 所在的元素放入 ifConditions 数组中
  function addIfCondition (el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  // markStatic$1
  if (node.ifConditions) {
    for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
      var block = node.ifConditions[i$1].block;
      markStatic$1(block);
      if (!block.static) {
        node.static = false;
      }
    }
  }
  // genIfConditions  转换 IfConditions 中的元素
  function genIfConditions (
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
    } else {
      return ("" + (genTernaryExp(condition.block)))
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp (el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }
~~~
* v-for

~~~js
  // 判断是否含有 v-for 指令 然后通过 extend 方法将 parseFor 转出的参数扩展到 元素上
  function processFor (el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      var res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          ("Invalid v-for expression: " + exp),
          el.rawAttrsMap['v-for']
        );
      }
    }
  }

  // 判断 for 循环
  function parseFor (exp) {
    // 正则表达式匹配，循环数组是否正确 [exp, item, 10]
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) { return }
    var res = {};
    res.for = inMatch[2].trim();
    // 针对 v-for="(item,index) in array" 进行处理 去除 item / item,index
    var alias = inMatch[1].trim().replace(stripParensRE, '');
    // 针对(item,index) in array 去除 , index
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim();
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    // alias 对象别名 可以通过 alias 访问遍历数组的元素
    // iterator1 遍历时第二个参数
    return res
  }

  // genFor 获取与 v-for 指令相关参数，调用 renderList 方法渲染数组
  function genFor (
    el,
    state,
    altGen,
    altHelper
  ) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
    var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

    if (state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
        "v-for should have explicit keys. " +
        "See https://vuejs.org/guide/list.html#key for more info.",
        el.rawAttrsMap['v-for'],
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    // 调用 renderList 方法 传入渲染函数
    return (altHelper || '_l') + "((" + exp + ")," +
      "function(" + alias + iterator1 + iterator2 + "){" +
        "return " + ((altGen || genElement)(el, state)) +
      '})'
  }

  // rederList
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        // 利用 Symbol.iterator 方法 循环 对象val
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }
~~~
* v-on

~~~js
  name = name.replace(onRE, '');
  isDynamic = dynamicArgRE.test(name);
  if (isDynamic) {
    name = name.slice(1, -1);
  }
  addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);

  // addHandler
  function addHandler (el,name,value,modifiers,important,warn,range,dynamic) {
    modifiers = modifiers || emptyObject;
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.',
        range
      );
    }

    // normalize click.right and click.middle since they don't actually fire
    // this is technically browser-specific, but at least for now browsers are
    // the only target envs that have right/middle clicks.
    if (modifiers.right) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
      } else if (name === 'click') {
        name = 'contextmenu';
        delete modifiers.right;
      }
    } else if (modifiers.middle) {
      if (dynamic) {
        name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
      } else if (name === 'click') {
        name = 'mouseup';
      }
    }
    // check capture modifier
    if (modifiers.capture) {
      delete modifiers.capture;
      name = prependModifierMarker('!', name, dynamic);
    }
    if (modifiers.once) {
      delete modifiers.once;
      name = prependModifierMarker('~', name, dynamic);
    }
    /* istanbul ignore if */
    if (modifiers.passive) {
      delete modifiers.passive;
      name = prependModifierMarker('&', name, dynamic);
    }

    var events;
    if (modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers;
    }

    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }

    el.plain = false;
  }
~~~

  **修饰器**
  * `.stop` 阻止默认事件 `event.stopPropagation()`
  * `.prevent` 阻止默认事件 `event.preventDefault()`
  * `.capture` 添加事件监听器使用 `capture` 模式
  * `.self` 只当事件从侦听器绑定的元素本身触发时才触发回调
  * `.{keyCode | keyAlias}` 只有特定键触发才会触发回调函数
  * `.native` 监听根元素的原生时间
  * `.once` 只触发一次回调
  * `.left` 点击鼠标左键触发
  * `.right` 点击鼠标右键触发
  * `.middle` 点击鼠标中键触发
  * `.passive` 以 `{passive: true}` 模式添加侦听器


* v-bind

~~~js
  name = name.replace(bindRE, '');
  value = parseFilters(value);
  isDynamic = dynamicArgRE.test(name);
  if (isDynamic) {
    name = name.slice(1, -1);
  }
  if (
    value.trim().length === 0
  ) {
    warn$2(
      ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
    );
  }
  if (modifiers) {
    if (modifiers.prop && !isDynamic) {
      name = camelize(name);
      if (name === 'innerHtml') { name = 'innerHTML'; }
    }
    if (modifiers.camel && !isDynamic) {
      name = camelize(name);
    }
    if (modifiers.sync) {
      syncGen = genAssignmentCode(value, "$event");
      if (!isDynamic) {
        addHandler(
          el,
          ("update:" + (camelize(name))),
          syncGen,
          null,
          false,
          warn$2,
          list[i]
        );
        if (hyphenate(name) !== camelize(name)) {
          addHandler(
            el,
            ("update:" + (hyphenate(name))),
            syncGen,
            null,
            false,
            warn$2,
            list[i]
          );
        }
      } else {
        // handler w/ dynamic event name
        addHandler(
          el,
          ("\"update:\"+(" + name + ")"),
          syncGen,
          null,
          false,
          warn$2,
          list[i],
          true // dynamic
        );
      }
    }
  }
  if ((modifiers && modifiers.prop) || (
    !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
  )) {
    addProp(el, name, value, list[i], isDynamic);
  } else {
    addAttr(el, name, value, list[i], isDynamic);
  }
~~~

  **修饰符**
  * `.prop` 作为 DOM 的property绑定，而不是作为 attribute 绑定
  * `。camel` 将事件名转化为驼峰模式
  * `.sync` 会扩展一个更新父组件绑定值的 `v-on` 监听器

* v-slot

~~~js
  function processSlotContent (el) {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          el.rawAttrsMap['scope'],
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          el.rawAttrsMap['slot-scope'],
          true
        );
      }
      el.slotScope = slotScope;
    }

    // slot="xxx"
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
      }
    }

    // 2.6 v-slot syntax
    {
      if (el.tag === 'template') {
        // v-slot on <template>
        var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (el.slotTarget || el.slotScope) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.parent && !maybeComponent(el.parent)) {
              warn$2(
                "<template v-slot> can only appear at the root level inside " +
                "the receiving component",
                el
              );
            }
          }
          var ref = getSlotName(slotBinding);
          var name = ref.name;
          var dynamic = ref.dynamic;
          el.slotTarget = name;
          el.slotTargetDynamic = dynamic;
          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
        }
      } else {
        // v-slot on component, denotes default slot
        var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding$1) {
          {
            if (!maybeComponent(el)) {
              warn$2(
                "v-slot can only be used on components or <template>.",
                slotBinding$1
              );
            }
            if (el.slotScope || el.slotTarget) {
              warn$2(
                "Unexpected mixed usage of different slot syntaxes.",
                el
              );
            }
            if (el.scopedSlots) {
              warn$2(
                "To avoid scope ambiguity, the default slot should also use " +
                "<template> syntax when there are other named slots.",
                slotBinding$1
              );
            }
          }
          // add the component's children to its default slot
          var slots = el.scopedSlots || (el.scopedSlots = {});
          var ref$1 = getSlotName(slotBinding$1);
          var name$1 = ref$1.name;
          var dynamic$1 = ref$1.dynamic;
          var slotContainer = slots[name$1] = createASTElement('template', [], el);
          slotContainer.slotTarget = name$1;
          slotContainer.slotTargetDynamic = dynamic$1;
          slotContainer.children = el.children.filter(function (c) {
            if (!c.slotScope) {
              c.parent = slotContainer;
              return true
            }
          });
          slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
          // remove children as they are returned from scopedSlots now
          el.children = [];
          // mark el non-plain so data gets generated
          el.plain = false;
        }
      }
    }
  }
~~~

* v-pre

  跳过这个元素和子元素的编译过程，显示原始的标签

* v-cloak

  无表达式，绑定一个空函数，隐藏未编译的 标签直到实例准备完成

* v-once

~~~js
  //  判断是否含有 v-once 指令
  function processOnce (el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }
  // v-once
  function genOnce (el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break
        }
        parent = parent.parent;
      }
      if (!key) {
        state.warn(
          "v-once can only be used inside v-for that is keyed. ",
          el.rawAttrsMap['v-once']
        );
        return genElement(el, state)
      }
      return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
    } else {
      return genStatic(el, state)
    }
~~~




