'use client'

import { useState, useEffect } from 'react'
import { Gift, User } from '@/types/gift'
import { giftService } from '@/services/giftService'
import { GiftCard } from '@/components/GiftCard'
import { supabase } from '@/lib/supabase'

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const data = await giftService.fetchGifts()
        setGifts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gifts')
      } finally {
        setLoading(false)
      }
    }

    fetchGifts()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await supabase.auth.getSession()
        if (session.data.session) {
          // Set user with proper role based on session data
          setUser(/* map session to User type */)
        }
      } catch (err) {
        setError('Authentication failed')
      }
    }
    
    checkAuth()
  }, [])

  const markAsPurchased = async (giftId: number, purchaserName: string) => {
    try {
      await giftService.markAsPurchased(giftId, purchaserName)
      
      // Update local state
      setGifts(gifts.map(gift => 
        gift.id === giftId 
          ? { ...gift, purchased: true, purchaser_name: purchaserName }
          : gift
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gift')
    }
  }

  const loadMore = async () => {
    const newGifts = await giftService.fetchGifts(page)
    setGifts(prev => [...prev, ...newGifts])
    setPage(p => p + 1)
    setHasMore(newGifts.length > 0)
  }

  if (loading) return <div className="text-center p-8">Loading...</div>
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-4">
          Gift List Registry
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to our gift registry! Browse through the available items and mark what you'd like to gift.
          Let's make this celebration special together! 🎁
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              user={user}
              onPurchase={markAsPurchased}
            />
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8 text-center">
            <button className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600">
              Add New Gift
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
