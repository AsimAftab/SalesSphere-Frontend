import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../ui/SuperadminComponents/dialog";
import { Badge } from "@/components/ui/SuperadminComponents/badge";
import { Label } from "@/components/ui/SuperadminComponents/label";
import { Textarea } from "@/components/ui/SuperadminComponents/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/SuperadminComponents/select";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  Clock,
  RefreshCw,
  Mail,
  FileText,
  Download,
  User
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/SuperadminComponents/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/SuperadminComponents/table";
import { Alert, AlertDescription } from "@/components/ui/SuperadminComponents/alert";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/SuperadminComponents/tabs";
import { extendSubscription, getOrganizationById, type SubscriptionHistoryEntry } from '@/api/SuperAdmin/organizationService';
import { getAllSystemUsersFromOverview, type SystemUserFromAPI } from '@/api/SuperAdmin/systemOverviewService';
import { Button as CustomButton } from '@/components/ui';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  paymentMethod: string;
  invoiceNumber: string;
}

interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
  currentPlan: string;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  onUpdate: (updates: {
    subscriptionStatus: "Active" | "Expired";
    subscriptionExpiry: string;
  }) => void;
}

export function SubscriptionManagementModal({
  isOpen,
  onClose,
  organizationId,
  organizationName,
  subscriptionStatus,
  subscriptionExpiry,
  onUpdate
}: SubscriptionManagementModalProps) {
  const [extensionMonths, setExtensionMonths] = useState("6");
  const [paymentNote, setPaymentNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [systemUsers, setSystemUsers] = useState<SystemUserFromAPI[]>([]);

  // Mock payment history
  const paymentHistory: PaymentHistory[] = [
    {
      id: "pay-001",
      date: "2024-08-15",
      amount: 149,
      status: "Completed",
      paymentMethod: "Credit Card",
      invoiceNumber: "INV-2024-001"
    },
    {
      id: "pay-002",
      date: "2024-07-15",
      amount: 149,
      status: "Completed",
      paymentMethod: "Credit Card",
      invoiceNumber: "INV-2024-002"
    },
    {
      id: "pay-003",
      date: "2024-06-15",
      amount: 149,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      invoiceNumber: "INV-2024-003"
    }
  ];

  // Fetch system users to match with extendedBy IDs
  const fetchSystemUsers = async () => {
    try {
      const users = await getAllSystemUsersFromOverview();
      setSystemUsers(users);
    } catch (error: unknown) {
      console.error('Failed to fetch system users:', error);
    }
  };

  // Fetch subscription history from backend
  const fetchSubscriptionHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await getOrganizationById(organizationId);
      if (response.data.subscriptionHistory) {
        setSubscriptionHistory(response.data.subscriptionHistory);
      }
    } catch (error: unknown) {
      console.error('Failed to fetch subscription history:', error);
      toast.error('Failed to load subscription history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper function to get user details by ID
  const getUserById = (userId: string) => {
    return systemUsers.find(user => user._id === userId || user.id === userId);
  };

  // Fetch subscription history and system users when modal opens
  useEffect(() => {
    if (isOpen && organizationId) {
      fetchSubscriptionHistory();
      fetchSystemUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, organizationId]);

  const handleRenewSubscription = async () => {
    setIsProcessing(true);

    try {
      // Map the selected months to the API format
      const extensionDuration = extensionMonths === '6' ? '6months' : '12months';

      // Call the API to extend subscription
      const response = await extendSubscription(organizationId, extensionDuration);

      // Update the parent component with new subscription data
      onUpdate({
        subscriptionStatus: "Active",
        subscriptionExpiry: response.data.organization.subscriptionEndDate.split('T')[0]
      });

      setIsProcessing(false);
      setPaymentNote("");

      // Refresh subscription history to show the new extension
      await fetchSubscriptionHistory();

      // Show success message from backend
      toast.success(
        <div className="flex flex-col">
          <strong>{response.message}</strong>
          <span className="text-sm">
            {`New expiry: ${new Date(response.data.extensionDetails.newEndDate).toLocaleDateString()}`}
          </span>
        </div>
      );
    } catch (error: unknown) {
      setIsProcessing(false);

      // Show error message
      toast.error(
        <div className="flex flex-col">
          <strong>Failed to extend subscription</strong>
          <span className="text-sm">
            {(error instanceof Error ? error.message : undefined) || 'An error occurred while extending the subscription'}
          </span>
        </div>
      );
    }
  };

  const handleSendPaymentReminder = () => {
    toast.success(
      <div className="flex flex-col">
        <strong>Payment reminder sent</strong>
        <span className="text-sm">Email sent to organization owner</span>
      </div>
    );
  };

  const handleDownloadInvoice = async (payment: PaymentHistory) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('PAYMENT INVOICE', 105, 20, { align: 'center' });

    // Add organization details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Organization: ${organizationName}`, 20, 40);
    doc.text(`Organization ID: ${organizationId}`, 20, 48);

    // Add invoice details box
    doc.setDrawColor(229, 231, 235); // Gray border
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.roundedRect(20, 60, 170, 50, 3, 3, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // Slate color
    doc.text('Invoice Details:', 25, 70);

    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice Number: ${payment.invoiceNumber}`, 25, 80);
    doc.text(`Date: ${new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 25, 88);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 25, 96);
    doc.text(`Status: ${payment.status}`, 25, 104);

    // Add amount box
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.roundedRect(20, 120, 170, 30, 3, 3, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('Amount Paid:', 25, 132);

    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text(`Rs. ${payment.amount.toFixed(2)}`, 25, 144);

    // Add subscription info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Subscription Information:', 20, 165);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Current Status: ${subscriptionStatus}`, 20, 173);
    doc.text(`Expiry Date: ${new Date(subscriptionExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 181);

    // Add footer
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175); // Gray color
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });
    doc.text('This is a computer-generated invoice.', 105, 276, { align: 'center' });

    // Add border
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);

    // Save the PDF
    doc.save(`Invoice_${payment.invoiceNumber}_${organizationName.replace(/\s+/g, '_')}.pdf`);

    toast.success(
      <div className="flex flex-col">
        <strong>Invoice downloaded successfully</strong>
        <span className="text-sm">{`${payment.invoiceNumber} has been downloaded`}</span>
      </div>
    );
  };

  const daysUntilExpiry = Math.ceil((new Date(subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;

  // Helper function to get status badge colors
  const getStatusBadgeColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return "bg-green-600 text-white";
      case 'rejected': return "bg-red-600 text-white";
      case 'in transit': return "bg-yellow-600 text-white";
      case 'in progress': return "bg-blue-600 text-white";
      case 'pending': return "bg-yellow-600 text-white";
      case 'failed': return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] !h-[96vh] overflow-hidden flex flex-col p-4">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Subscription Management</DialogTitle>
              <DialogDescription>
                {organizationName} • {organizationId}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2 flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="history">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3 overflow-y-auto flex-1">
            {/* Current Status */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-slate-900 flex items-center gap-2 mb-1 text-sm font-semibold">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    Current Subscription
                  </h3>
                  <p className="text-slate-600 text-xs">Active subscription details and status</p>
                </div>
                <Badge
                  variant={subscriptionStatus === "Active" ? "default" : "destructive"}
                  className={subscriptionStatus === "Active" ? "bg-green-500" : ""}
                >
                  {subscriptionStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-slate-500 text-xs mb-1">Expiry Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-900 font-medium">
                      {new Date(subscriptionExpiry).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-slate-500 text-xs mb-1">Days Remaining</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <p className={`font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-green-600'}`}>
                      {isExpired ? 'Expired' : `${daysUntilExpiry} days`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {isExpired && (
              <Alert className="border-red-200 bg-red-50 py-2">
                <AlertCircle className="h-3 w-3 text-red-600" />
                <AlertDescription className="text-red-800 text-xs">
                  <p className="font-medium">Subscription Expired</p>
                  <p className="text-xs mt-0.5">Renew now to restore access.</p>
                </AlertDescription>
              </Alert>
            )}

            {isExpiringSoon && !isExpired && (
              <Alert className="border-amber-200 bg-amber-50 py-2">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                <AlertDescription className="text-amber-800 text-xs">
                  <p className="font-medium">Subscription Expiring Soon</p>
                  <p className="text-xs mt-0.5">Only {daysUntilExpiry} days remaining. Consider sending a payment reminder.</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              {/* Extend Subscription */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                <h4 className="text-slate-900 flex items-center gap-2 mb-3 text-sm font-semibold">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  Extend Subscription
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="extension" className="text-xs">Extension Period</Label>
                    <Select value={extensionMonths} onValueChange={setExtensionMonths}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentNote" className="text-xs">Payment Note (Optional)</Label>
                    <Textarea
                      id="paymentNote"
                      placeholder="e.g., Payment received via bank transfer"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <CustomButton
                    onClick={handleRenewSubscription}
                    disabled={isProcessing}
                    variant="primary"
                    className="w-full text-sm"
                  >
                    {isProcessing ? "Processing..." : `Extend for ${extensionMonths} Month${parseInt(extensionMonths) > 1 ? 's' : ''}`}
                  </CustomButton>
                </div>
              </div>

              {/* Send Payment Reminder */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                <h4 className="text-slate-900 flex items-center gap-2 mb-2 text-sm font-semibold">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Payment Reminder
                </h4>
                <p className="text-slate-600 text-xs mb-3">
                  Send a payment reminder email to the organization owner with subscription details and payment instructions.
                </p>
                <CustomButton
                  onClick={handleSendPaymentReminder}
                  variant="outline"
                  className="w-full text-sm"
                >
                  <Mail className="w-3 h-3 mr-2" />
                  Send Reminder
                </CustomButton>
                <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Last reminder sent: Never
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments" className="space-y-3 overflow-y-auto flex-1">
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs py-2">Date</TableHead>
                    <TableHead className="text-xs py-2">Invoice</TableHead>
                    <TableHead className="text-xs py-2">Amount</TableHead>
                    <TableHead className="text-xs py-2">Payment Method</TableHead>
                    <TableHead className="text-xs py-2">Status</TableHead>
                    <TableHead className="text-right text-xs py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-slate-600 text-sm py-2">
                        {new Date(payment.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-slate-900 font-mono text-sm py-2">
                        {payment.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-slate-900 font-medium text-sm py-2">
                        ₹{payment.amount}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm py-2">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`${getStatusBadgeColor(payment.status)} text-xs`}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <CustomButton
                          variant="ghost"
                          className="text-xs py-1 px-3"
                          onClick={() => handleDownloadInvoice(payment)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Activity History Tab */}
          <TabsContent value="history" className="space-y-3 overflow-y-auto flex-1">
            <div className="bg-white rounded-lg border">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                  <span className="ml-2 text-slate-600">Loading subscription history...</span>
                </div>
              ) : subscriptionHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-slate-600 font-medium">No subscription history</p>
                  <p className="text-slate-400 text-sm">Subscription extensions will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs py-2">Extension Date</TableHead>
                      <TableHead className="text-xs py-2">Duration</TableHead>
                      <TableHead className="text-xs py-2">Previous End Date</TableHead>
                      <TableHead className="text-xs py-2">New End Date</TableHead>
                      <TableHead className="text-xs py-2">Extended By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionHistory.map((item) => {
                      // Get the full user details from system users
                      // item.extendedBy is the user ID string
                      const userDetails = getUserById(item.extendedBy);

                      const displayName = userDetails?.name || 'Unknown User';
                      const displayEmail = userDetails?.email || 'N/A';
                      const displayRole = userDetails?.role || 'unknown';
                      const displayId = userDetails?._id || item.extendedBy || 'N/A';

                      return (
                        <TableRow key={item._id}>
                          <TableCell className="text-slate-600 text-sm py-2">
                            {new Date(item.extensionDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="py-2">
                            <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                              {item.extensionDuration === '6months' ? '6 Months' : '12 Months'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm py-2">
                            {new Date(item.previousEndDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-slate-900 font-medium text-sm py-2">
                            {new Date(item.newEndDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="py-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-help">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-900">{displayName}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className={
                                        displayRole.toLowerCase() === "superadmin"
                                          ? "bg-blue-600 text-white"
                                          : displayRole.toLowerCase() === "developer"
                                          ? "bg-green-600 text-white"
                                          : "bg-slate-600 text-white"
                                      }>
                                        {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
                                      </Badge>
                                    </div>
                                    <div className="text-xs space-y-1">
                                      <p className="font-medium text-slate-900">
                                        <span className="text-slate-500">ID:</span> {displayId}
                                      </p>
                                      <p className="text-slate-700">
                                        <span className="text-slate-500">Email:</span> {displayEmail}
                                      </p>
                                      <p className="text-slate-700">
                                        <span className="text-slate-500">Name:</span> {displayName}
                                      </p>
                                      {userDetails?.phone && (
                                        <p className="text-slate-700">
                                          <span className="text-slate-500">Phone:</span> {userDetails.phone}
                                        </p>
                                      )}
                                      {userDetails?.address && (
                                        <p className="text-slate-700">
                                          <span className="text-slate-500">Address:</span> {userDetails.address}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
