import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ContentItem, ContentType, ImpactStat } from "@/lib/site-data";
import { demoStats } from "@/lib/site-data";

export function useContent(type?: ContentType) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function load() {
      let query = supabase.from("content_items").select("*").eq("status", "published").order("featured", { ascending: false }).order("published_at", { ascending: false });
      if (type) query = query.eq("content_type", type);
      const { data } = await query;
      if (active) { setItems((data ?? []) as ContentItem[]); setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [type]);
  return { items, loading };
}

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStat[]>(demoStats);
  useEffect(() => {
    supabase.from("impact_statistics").select("id,label,value,unit,display_order").eq("is_active", true).order("display_order")
      .then(({ data }) => { if (data?.length) setStats(data as ImpactStat[]); });
  }, []);
  return stats;
}
