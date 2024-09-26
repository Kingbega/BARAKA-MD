'use strict';
class Base {
 constructor(client, msg) {
  Object.defineProperty(this, 'client', { value: client });
  Object.defineProperty(this, 'm', { value: msg });
 }

 _clone() {
  return Object.assign(Object.create(this), this);
 }

 _patch(data) {
  return data;
 }
}

module.exports = Base;
