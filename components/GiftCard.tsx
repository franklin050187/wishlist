import Image from 'next/image'
import { Gift, User } from '@/types/gift'
import { useState } from 'react'

interface GiftCardProps {
  gift: Gift
  user: User | null
  onPurchase: (giftId: number, purchaserName: string) => void
}

export function GiftCard({ gift, user, onPurchase }: GiftCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="relative h-48 mb-4">
        {!imageError ? (
          <Image
            src={gift.image_url}
            alt={gift.title}
            fill
            className="rounded-md object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>Image unavailable</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-purple-700 mb-2">{gift.title}</h3>
      <p className="text-gray-600 mb-4">{gift.description}</p>
      <a 
        href={gift.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 mb-4 block"
      >
        View Item →
      </a>

      {user?.role === 'admin' && (
        <div className="mt-4">
          <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 mr-2">
            Edit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Delete
          </button>
        </div>
      )}

      {user?.role === 'user' && !gift.purchased && (
        <button
          onClick={() => {
            // Don't use prompt - security risk and poor UX
            // Replace with proper form modal component
            const name = prompt('Please enter your name:') // Bad practice
            if (name) onPurchase(gift.id, name)
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full"
        >
          Mark as Purchased
        </button>
      )}

      {gift.purchased && (
        <div className="mt-4 text-green-600 font-semibold">
          {user?.role === 'viewer' 
            ? '✓ Purchased'
            : `✓ Purchased by ${gift.purchaser_name}`
          }
        </div>
      )}
    </div>
  )
} 