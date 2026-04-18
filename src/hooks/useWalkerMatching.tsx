import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MatchingCriteria {
  ownerLat?: number;
  ownerLng?: number;
  ownerCity?: string;
  serviceType?: string;
  dogSize?: string;
  preferredDays?: string[];
  preferredTime?: string;
  maxBudget?: number;
  preferVerified?: boolean;
  minRating?: number;
}

interface WalkerWithScore {
  id: string;
  user_id: string;
  hourly_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  verified: boolean | null;
  services: string[] | null;
  experience_years: number | null;
  latitude: number | null;
  longitude: number | null;
  available_days: string[] | null;
  available_hours_start: string | null;
  available_hours_end: string | null;
  max_dogs: number | null;
  service_radius_km: number | null;
  // Profile data
  first_name?: string;
  avatar_url?: string;
  city?: string;
  bio?: string;
  // Matching score
  matchScore: number;
  matchReasons: string[];
}

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useWalkerMatching = (initialCriteria?: MatchingCriteria) => {
  const [loading, setLoading] = useState(false);
  const [matchedWalkers, setMatchedWalkers] = useState<WalkerWithScore[]>([]);

  const calculateMatchScore = useCallback((
    walker: any,
    profile: any,
    criteria: MatchingCriteria
  ): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Rating score (max 30 points)
    if (walker.rating) {
      const ratingScore = (walker.rating / 5) * 30;
      score += ratingScore;
      if (walker.rating >= 4.5) {
        reasons.push(`Excellente note (${walker.rating.toFixed(1)}⭐)`);
      }
    }

    // 2. Experience score (max 15 points)
    if (walker.experience_years) {
      const expScore = Math.min(walker.experience_years * 2, 15);
      score += expScore;
      if (walker.experience_years >= 3) {
        reasons.push(`${walker.experience_years} ans d'expérience`);
      }
    }

    // 3. Verification bonus (15 points)
    if (walker.verified) {
      score += 15;
      reasons.push("Accompagnateur Certifié ✓");
    }

    // 4. Distance score (max 20 points)
    if (criteria.ownerLat && criteria.ownerLng && walker.latitude && walker.longitude) {
      const distance = calculateDistance(
        criteria.ownerLat, criteria.ownerLng,
        walker.latitude, walker.longitude
      );
      const radiusKm = walker.service_radius_km || 10;
      
      if (distance <= radiusKm) {
        const distanceScore = Math.max(0, 20 - (distance / radiusKm) * 10);
        score += distanceScore;
        if (distance <= 3) {
          reasons.push(`À ${distance.toFixed(1)} km de vous`);
        }
      }
    } else if (criteria.ownerCity && profile?.city) {
      // City matching if no coordinates
      if (profile.city.toLowerCase().includes(criteria.ownerCity.toLowerCase())) {
        score += 15;
        reasons.push(`Disponible à ${profile.city}`);
      }
    }

    // 5. Service match (10 points)
    if (criteria.serviceType && walker.services) {
      if (walker.services.includes(criteria.serviceType)) {
        score += 10;
        reasons.push(`Propose ce service`);
      }
    }

    // 6. Availability match (max 10 points)
    if (criteria.preferredDays && walker.available_days) {
      const matchingDays = criteria.preferredDays.filter(
        day => walker.available_days?.includes(day)
      );
      if (matchingDays.length > 0) {
        const availScore = (matchingDays.length / criteria.preferredDays.length) * 10;
        score += availScore;
        if (matchingDays.length === criteria.preferredDays.length) {
          reasons.push("Disponible tous vos jours");
        }
      }
    }

    // 7. Budget compatibility bonus (5 points)
    if (criteria.maxBudget && walker.hourly_rate) {
      if (walker.hourly_rate <= criteria.maxBudget) {
        score += 5;
        if (walker.hourly_rate <= criteria.maxBudget * 0.8) {
          reasons.push("Tarif avantageux");
        }
      }
    }

    // 8. Reviews count bonus (max 5 points)
    if (walker.total_reviews) {
      const reviewsScore = Math.min(walker.total_reviews / 10, 5);
      score += reviewsScore;
      if (walker.total_reviews >= 20) {
        reasons.push(`${walker.total_reviews} avis clients`);
      }
    }

    return { score: Math.round(score), reasons };
  }, []);

  const findMatches = useCallback(async (criteria: MatchingCriteria) => {
    setLoading(true);

    try {
      // Fetch all walker profiles
      let query = supabase
        .from("walker_profiles")
        .select("*");

      // Filter by service if specified
      if (criteria.serviceType) {
        query = query.contains("services", [criteria.serviceType]);
      }

      const { data: walkerProfiles, error } = await query;
      if (error) throw error;

      if (!walkerProfiles || walkerProfiles.length === 0) {
        setMatchedWalkers([]);
        return [];
      }

      // Fetch profile data
      const userIds = walkerProfiles.map(w => w.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, avatar_url, city, bio")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Calculate match scores
      const scoredWalkers: WalkerWithScore[] = walkerProfiles
        .map(walker => {
          const profile = profileMap.get(walker.user_id);
          const { score, reasons } = calculateMatchScore(walker, profile, criteria);
          
          return {
            ...walker,
            ...profile,
            matchScore: score,
            matchReasons: reasons
          };
        })
        .filter(w => w.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedWalkers(scoredWalkers);
      return scoredWalkers;
    } catch (error) {
      console.error("Matching error:", error);
      setMatchedWalkers([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [calculateMatchScore]);

  const getTopMatches = useCallback((count: number = 5) => {
    return matchedWalkers.slice(0, count);
  }, [matchedWalkers]);

  const getMatchByUserId = useCallback((userId: string) => {
    return matchedWalkers.find(w => w.user_id === userId);
  }, [matchedWalkers]);

  // Auto-fetch when criteria provided
  useEffect(() => {
    if (initialCriteria) {
      findMatches(initialCriteria);
    }
  }, []);

  return {
    loading,
    isLoading: loading,
    matchedWalkers,
    findMatches,
    getTopMatches,
    getMatchByUserId
  };
};

export default useWalkerMatching;
