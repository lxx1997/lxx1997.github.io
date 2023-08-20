---
title: React Hooks - 自定义hooks
categories:
  - [react]
  - [hooks]
tags:
  - react
  - hooks
cover: /assets/blogCover/49566364_p0.jpg
date: 2022-08-09 09:55:31
updated: 2022-08-09 09:55:31
---


**Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性**

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React

## react hooks

#### useEffect

useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力

它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途

在使用时我们传递一个数组，useEffect 会在数组内的数据发生变化时重新执行

useEffect 函数需返回一个清除函数，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则在执行下一个 effect 之前，上一个 effect 就已被清除

~~~js
useEffect(() => {
  return () => {
    // 在此执行当前useEffect 的副作用清除，例如监听函数，定时器等操作
  }
}, [obj1, obj2]) // 仅在 obj1， obj2 改变的时候触发
~~~

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。

#### useState

useState 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。

更新函数操作是完全替换，而非合并操作

~~~js
const [count, setCount] = useState(0) // 初始化 count

setCount(1) // 改变 count 值
setCount(x => x + 1) // 改变 count 值 会基于原count 值的基础上 +1
~~~

#### useContext 上下文对象

用来接收由React.createContext() 创建的 context对象，并返回context对象的当前值，父组件需要有 `<MyContext.Provider>` 包裹着，值由 value 确定

~~~js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
~~~

#### useReducer

useReducer 是 useState 的替代方案，它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法

~~~js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
~~~

在上述例子中，当修改 state 里面的值的时候，会通过dispatch 传递一个比较复杂的值作为 reducer 方法中的 action，在reducer 内部通过 action 的值来进行代码运算，返回出新的值

#### useCallback

React useCallbackHook 返回一個記憶化的回調函數。這使我們能夠隔離資源密集型功能，以便它們不會在每次渲染時自動運行。

使用useCallback鉤子來防止函數被重新創建，除非有必要。

~~~js
const addTodo = useCallback(() => {
  setTodos((t) => [...t, "New Todo"]);
}, [todos]);
~~~

当组件内容发生变化重新渲染的时候，如果 `todos` 没有发生变化的话，addTodo 函数不会重新创建


#### useMemo

React useCallbackHook 返回一個記憶化的值，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算

传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行不应该在渲染期间内执行的操作

~~~js
const Todo = ({ todos }) => {
  return <div>{
    todos.map(item => <div>
    {item.name}
    </div>)
  }</div>
}

export default useMemo(Todo)
~~~

以上 Todo 组件仅会在 todos 参数发生变化时才会重新计算渲染，如果传入内容有函数，可以和 useCallback 接合，实现值的缓存
#### useRef

useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内持续存在。

useRef 既可以用来存储 dom 对象，也可以用来存储单个的值

当 ref 对象内容发生变化时，useRef 并不会通知你。变更 .current 属性不会引发组件重新渲染。

~~~js
const ref = useRef(1)
console.log(ref.current)
ref.current = 2
console.log(ref.current)
~~~

#### useImperativeHandle 和 forwardRef

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。

父组件使用 forwardRef 来接收子组件暴露出的实例值

~~~js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}

function App() {
  FancyInput = forwardRef(FancyInput);

  function focus() {
    inputRef.current.focus()
  }
  return <FancyInput ref={inputRef} />
}
~~~

#### useLayoutEffect

其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

#### useDebugValue

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签。

~~~js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
~~~

#### useDeferredValue

useDeferredValue 接受一个值，并返回该值的新副本，该副本将推迟到更紧急地更新之后。如果当前渲染是一个紧急更新的结果，比如用户输入，React 将返回之前的值，然后在紧急渲染完成后渲染新的值。

该 hook 与使用防抖和节流去延迟更新的用户空间 hooks 类似。使用 useDeferredValue 的好处是，React 将在其他工作完成（而不是等待任意时间）后立即进行更新，并且像 startTransition 一样，延迟值可以暂停，而不会触发现有内容的意外降级。

~~~js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing 告诉 React 仅当 deferredQuery 改变，
  // 而不是 query 改变的时候才重新渲染
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
~~~

#### useTransition

返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数。

isPending 指示过渡任务何时活跃以显示一个等待状态：
startTransition 用来启动过渡任务

~~~js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
~~~

#### useId

useId 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook。


## 自定义 Hooks

在知道上述 hooks 之后，react 也支持我们自定义 hooks 操作。

自定义 hooks 主要是用来 提取共享逻辑，优化代码结构。

<!-- 例如获取和修改用户信息 -->
~~~js
const useUserInfo = () => {
  const [useInfo, setUseInfo] = useState(null)

  useEffect(() => {
    // 这里做处理用户的个人信息
  })
  return useInfo
}


const useInfo = useUserInfo()
~~~
