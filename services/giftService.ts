import { supabase } from '@/utils/supabase'
import { Gift } from '@/types/gift'

export const giftService = {
  async fetchGifts(): Promise<Gift[]> {
    try {
      const { data, error } = await Promise.race([
        supabase.from('gifts').select('*').order('id'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ])
      
      if (error) throw new Error(`Failed to fetch gifts: ${error.message}`)
      if (!data) throw new Error('No data received')
      return data
    } catch (error) {
      throw new Error(`Gift fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  async markAsPurchased(giftId: number, purchaserName: string): Promise<void> {
    const { error } = await supabase
      .from('gifts')
      .update({ purchased: true, purchaser_name: purchaserName })
      .eq('id', giftId)

    if (error) throw error
  }
} 