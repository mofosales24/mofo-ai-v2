import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { User, Brand } from "../types";
export const cloudService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy("createdAt", "desc")));
      return snap.docs.map(d => d.data() as User);
    } catch (e) { return []; }
  },
  saveUser: async (user: User) => { await setDoc(doc(db, 'users', user.id), user, { merge: true }); },
  deleteUser: async (id: string) => { await deleteDoc(doc(db, 'users', id)); },
  getBrands: async (userId?: string): Promise<Brand[]> => {
    try {
      const q = userId ? query(collection(db, 'brands'), where("userId", "==", userId), orderBy("updatedAt", "desc")) : query(collection(db, 'brands'), orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as Brand);
    } catch (e) { return []; }
  },
  saveBrand: async (brand: Brand) => { await setDoc(doc(db, 'brands', brand.id), brand, { merge: true }); },
  deleteBrand: async (id: string) => { await deleteDoc(doc(db, 'brands', id)); }
};
