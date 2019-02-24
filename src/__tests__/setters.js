const {
  compile,
  and,
  or,
  root,
  arg0,
  arg1,
  setter,
  splice,
  bind,
  chain,
  template
} = require('../../index');
const {
  describeCompilers,
  funcLibrary
} = require('../test-utils');
const _ = require('lodash');

describe('setters', () => {
  describeCompilers(['simple', 'optimizing'], compiler => {
    it('should allow variable args in between constant args', () => {
      const model = {
        data: root.get('a'),
        setInner: setter('a', arg0, 'c')
      }
      const optCode = eval(compile(model, {
        compiler
      }));
      const inst = optCode({
        a: {b: {c: 'nothing'}}
      }, funcLibrary);
      inst.setInner('b', 'hello')
      expect(inst.data).toEqual({
        b: {
          c: 'hello'
        }
      });
    })
    it('should allow deep setting of an object', () => {
      const model = {
        outer: root.get('a').mapValues(a => a),
        setInner: setter('a', 'b', 'c')
      }
      const optCode = eval(compile(model, {
        compiler
      }));
      const inst = optCode({
        a: {}
      }, funcLibrary);
      inst.setInner('hello')
      expect(inst.outer).toEqual({
        b: {
          c: 'hello'
        }
      });
    })
    it('should allow deep setting of an array', () => {
      const model = {
        outer: root.get('a').mapValues(a => a),
        setInner: setter('a', 'b', 0, 'c')
      }
      const optCode = eval(compile(model, {
        compiler
      }));
      const inst = optCode({
        a: {}
      }, funcLibrary);
      inst.setInner('hello')
      expect(inst.outer).toEqual({
        b: [{
          c: 'hello'
        }]
      });
    })

    it('should allow deep splicing', () => {
      const model = {
        outer: root.get('a').mapValues(a => a),
        spliceInner: splice('a', 'b')
      }
      const optCode = eval(compile(model, {
        compiler
      }));
      const inst = optCode({
        a: {}
      }, funcLibrary);
      inst.spliceInner(0, 0, 'hello')
      expect(inst.outer).toEqual({
        b: ['hello']
      });
    })
  })
})
