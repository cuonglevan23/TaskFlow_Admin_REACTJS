import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/custom/button'

interface Review {
  id: string
  customerName: string
  customerAvatar: string
  productName: string
  rating: number
  comment: string
  date: Date
  helpful: number
  notHelpful: number
  status: 'Published' | 'Pending' | 'Rejected'
}

const initialReviews: Review[] = [
  { id: '1', customerName: 'John Doe', customerAvatar: '/avatars/john-doe.png', productName: 'Running Shoe X1', rating: 5, comment: 'Great shoes! Very comfortable for long runs.', date: new Date(2023, 5, 15), helpful: 10, notHelpful: 1, status: 'Published' },
  { id: '2', customerName: 'Jane Smith', customerAvatar: '/avatars/jane-smith.png', productName: 'Casual Sneaker Y2', rating: 3, comment: 'Decent shoes, but not as durable as I expected.', date: new Date(2023, 5, 20), helpful: 5, notHelpful: 2, status: 'Published' },
  { id: '3', customerName: 'Mike Johnson', customerAvatar: '/avatars/mike-johnson.png', productName: 'Hiking Boot Z3', rating: 4, comment: 'Good grip on rough terrain. Could use more ankle support.', date: new Date(2023, 5, 25), helpful: 8, notHelpful: 1, status: 'Pending' },
]

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)

  const filteredReviews = reviews.filter(review =>
    review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
  }

  const handleStatusChange = (id: string, newStatus: 'Published' | 'Pending' | 'Rejected') => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: newStatus } : review
    ))
  }

  const handleReplySubmit = () => {
    if (selectedReview) {
      // In a real application, you would send this reply to the backend
      // Reply to review functionality
      setIsReplyDialogOpen(false)
      setReplyText('')
      setSelectedReview(null)
    }
  }

  const handleHelpfulnessUpdate = (id: string, isHelpful: boolean) => {
    setReviews(reviews.map(review => 
      review.id === id ? { 
        ...review, 
        helpful: isHelpful ? review.helpful + 1 : review.helpful,
        notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
      } : review
    ))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Helpfulness</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={review.customerAvatar} />
                    <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {review.customerName}
                </div>
              </TableCell>
              <TableCell>{review.productName}</TableCell>
              <TableCell>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
              </TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>{review.date.toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" onClick={() => handleHelpfulnessUpdate(review.id, true)}>
                    <ThumbsUp className="h-4 w-4 mr-1" /> {review.helpful}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleHelpfulnessUpdate(review.id, false)}>
                    <ThumbsDown className="h-4 w-4 mr-1" /> {review.notHelpful}
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={review.status === 'Published' ? "outline" : review.status === 'Pending' ? "outline" : "destructive"}
                >
                  {review.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleStatusChange(review.id, 'Published')}>
                  Publish
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleStatusChange(review.id, 'Rejected')}>
                  Reject
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedReview(review)
                  setIsReplyDialogOpen(true)
                }}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Reply
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>Enter your reply to the customer's review.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reply" className="text-right">Reply</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleReplySubmit}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}