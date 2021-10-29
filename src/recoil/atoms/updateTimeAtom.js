import { atom } from 'recoil';

const updateTimeAtom = atom({
  key: 'updateTimeState',
  default: new Date()
});

export default updateTimeAtom;
