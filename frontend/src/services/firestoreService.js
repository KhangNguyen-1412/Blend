import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from '../config/firebase';

/**
 * 1. FIRESTORE RESERVATIONS SERVICE (SỔ ĐẶT CHỖ REALTIME)
 */
export const firestoreReservations = {
  // Collection reference
  getCollection: () => collection(db, 'reservations'),

  // Create a new reservation in Firestore
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        ...data,
        createdAt: serverTimestamp(),
        source: 'Landing Page Booking',
        status: data.status || 'Chờ xác nhận'
      });
      return { success: true, id: docRef.id, ...data };
    } catch (error) {
      console.warn('Firestore addDoc warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Fetch all reservations once
  getAll: async () => {
    try {
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, data: list };
    } catch (error) {
      console.warn('Firestore getDocs warning:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Realtime subscription
  subscribe: (callback) => {
    try {
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      }, (err) => {
        console.warn('Firestore onSnapshot listener error:', err.message);
      });
    } catch (error) {
      console.warn('Firestore subscribe failed:', error.message);
      return () => {};
    }
  },

  // Update status or fields
  update: async (id, updateData) => {
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.warn('Firestore updateDoc warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a reservation
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      return { success: true };
    } catch (error) {
      console.warn('Firestore deleteDoc warning:', error.message);
      return { success: false, error: error.message };
    }
  }
};

/**
 * 2. FIRESTORE ORDERS SERVICE (ĐƠN HÀNG REALTIME)
 */
export const firestoreOrders = {
  create: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        status: orderData.status || 'Chờ xác nhận'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.warn('Firestore order create warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  subscribe: (callback) => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      }, (err) => {
        console.warn('Firestore orders snapshot error:', err.message);
      });
    } catch (error) {
      return () => {};
    }
  }
};

/**
 * 3. FIRESTORE GUESTBOOK (LƯU BÚT TÒA SOẠN)
 */
export const firestoreGuestbook = {
  create: async (entry) => {
    try {
      const docRef = await addDoc(collection(db, 'guestbook'), {
        ...entry,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.warn('Firestore guestbook create warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  subscribe: (callback) => {
    try {
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      }, (err) => {
        console.warn('Firestore guestbook snapshot error:', err.message);
      });
    } catch (error) {
      return () => {};
    }
  }
};

/**
 * 4. FIRESTORE STAFF SERVICE (DANH BỘ NHÂN SỰ & QUẢN TRỊ VIÊN CLOUD)
 */
export const firestoreStaff = {
  getCollection: () => collection(db, 'staff'),

  create: async (staffData) => {
    try {
      const docId = String(staffData.id || staffData.username || Date.now());
      const docRef = doc(db, 'staff', docId);
      await setDoc(docRef, {
        id: staffData.id || null,
        name: staffData.name || '',
        username: staffData.username || '',
        role: staffData.role || 'Pha chế',
        status: staffData.status || 'Hoạt động',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: 'Blend Guild Staff Management'
      }, { merge: true });
      return { success: true, id: docId };
    } catch (error) {
      console.warn('Firestore staff create warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'staff'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, data: list };
    } catch (error) {
      console.warn('Firestore staff getAll warning:', error.message);
      return { success: false, error: error.message, data: [] };
    }
  },

  subscribe: (callback) => {
    try {
      const q = query(collection(db, 'staff'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      }, (err) => {
        console.warn('Firestore staff snapshot error:', err.message);
      });
    } catch (error) {
      return () => {};
    }
  },

  update: async (id, updateData) => {
    try {
      const docRef = doc(db, 'staff', String(id));
      await setDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.warn('Firestore staff updateDoc warning:', error.message);
      return { success: false, error: error.message };
    }
  },

  delete: async (id) => {
    try {
      const docRef = doc(db, 'staff', String(id));
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.warn('Firestore staff deleteDoc warning:', error.message);
      return { success: false, error: error.message };
    }
  }
};

export default {
  reservations: firestoreReservations,
  orders: firestoreOrders,
  guestbook: firestoreGuestbook,
  staff: firestoreStaff
};
