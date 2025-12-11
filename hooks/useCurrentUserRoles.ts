import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
export function useCurrentUserRoles(teamId: string | null) {
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

}