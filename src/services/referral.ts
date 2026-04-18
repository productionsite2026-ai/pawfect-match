/**
 * Service Parrainage - Système de codes de parrainage et récompenses
 * Fonctionne côté client avec génération locale de codes
 */

export interface ReferralCode {
  id: string;
  code: string;
  referrerId: string;
  referrerName: string;
  createdAt: Date;
  expiresAt?: Date;
  active: boolean;
  usageCount: number;
  maxUsages?: number;
  rewardAmount: number;
  rewardType: 'credit' | 'discount' | 'commission';
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referralCodeId: string;
  referredUserId: string;
  referredUserName: string;
  rewardAmount: number;
  rewardType: 'credit' | 'discount' | 'commission';
  status: 'pending' | 'earned' | 'paid';
  earnedAt: Date;
  paidAt?: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewardsEarned: number;
  totalRewardsPaid: number;
  pendingRewards: number;
}

/**
 * Générer un code de parrainage unique
 */
export function generateReferralCode(referrerId: string, referrerName: string): ReferralCode {
  const code = `GOG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return {
    id: `ref-${Date.now()}`,
    code,
    referrerId,
    referrerName,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    active: true,
    usageCount: 0,
    maxUsages: undefined,
    rewardAmount: 10,
    rewardType: 'credit',
  };
}

/**
 * Obtenir les stats de parrainage (local/demo)
 */
export function getDefaultReferralStats(): ReferralStats {
  return {
    totalReferrals: 0,
    activeReferrals: 0,
    totalRewardsEarned: 0,
    totalRewardsPaid: 0,
    pendingRewards: 0,
  };
}

export default {
  generateReferralCode,
  getDefaultReferralStats,
};
