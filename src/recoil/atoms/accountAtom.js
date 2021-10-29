import { atom } from 'recoil';

const accountAtom = atom({
  key: 'accountState',
  default: {}
});

export default accountAtom;
