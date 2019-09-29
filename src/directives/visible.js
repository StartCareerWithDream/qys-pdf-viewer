import 'intersection-observer';

const { log } = console;

const instances = new WeakMap();

function disconnectObserver(observer) {
  if (observer) observer.disconnect();
}

function createObserver(el, vnode, modifiers, callback) {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      callback();
      if (modifiers.once) {
        disconnectObserver(observer, el);
      }
    }
  });

  vnode.context.$nextTick(() => observer.observe(el));

  return observer;
}

function bind(el, { value, modifiers }, vnode) {
  if (typeof window.IntersectionObserver === 'undefined') {
    log('您的浏览器不支持本API');
  } else {
    const observer = createObserver(el, vnode, modifiers, () => {
      const callback = value;
      if (typeof callback === 'function') callback();
    });
    instances.set(el, { observer });
  }
}

function update(el, { value, oldValue }, vnode) {
  if (value === oldValue) return;

  const { observer } = instances.get(el);
  disconnectObserver(observer, el);
  bind(el, { value }, vnode);
}

function unbind(el) {
  if (instances.has(el)) {
    const { observer } = instances.get(el);
    disconnectObserver(observer, el);
    instances.delete(el);
  }
}

export default {
  bind,
  update,
  unbind,
};
