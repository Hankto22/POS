import { useEffect, useState } from 'react';
import { getCustomers, getSales, getCampaigns, createCampaign, sendCampaign, getFeedbacks, createFeedback, getOffers, updateOffer, triggerBirthdayOffers, triggerVIPOffers, createCustomer } from '../services/api';
import type { Customer, Sale, Campaign, Feedback, Offer } from '../types/components';

export default function Customers() {
  const [activeTab, setActiveTab] = useState<'customers' | 'campaigns' | 'feedback' | 'offers'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerHistory, setCustomerHistory] = useState<Sale[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateFeedback, setShowCreateFeedback] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', type: 'SMS', message: '', targetTiers: '' });
  const [newFeedback, setNewFeedback] = useState({ customerId: '', rating: 5, comment: '' });
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    preferences: '',
    membershipTier: 'Bronze'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, salesRes, campaignsRes, feedbacksRes, offersRes] = await Promise.all([
          getCustomers(),
          getSales(),
          getCampaigns(),
          getFeedbacks(),
          getOffers()
        ]);
        setCustomers(customersRes.data || []);
        setSales(salesRes.data || []);
        setCampaigns(campaignsRes.data || []);
        setFeedbacks(feedbacksRes.data || []);
        setOffers(offersRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCustomers([]);
        setSales([]);
        setCampaigns([]);
        setFeedbacks([]);
        setOffers([]);
      }
    };
    fetchData();
  }, []);

  const viewCustomerHistory = (customer: Customer) => {
    const history = sales.filter(sale => sale.customerId === customer.id);
    setSelectedCustomer(customer);
    setCustomerHistory(history);
    setShowHistory(true);
  };

  const getCustomerStats = (customer: Customer) => {
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = customerSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const lastVisit = customerSales.length > 0 ?
      new Date(Math.max(...customerSales.map(s => new Date(s.createdAt || '').getTime()))) : null;

    return { totalSpent, totalItems, lastVisit, visitCount: customerSales.length };
  };

  const handleCreateCampaign = async () => {
    try {
      await createCampaign(newCampaign);
      setNewCampaign({ name: '', type: 'SMS', message: '', targetTiers: '' });
      setShowCreateCampaign(false);
      // Refresh campaigns
      const res = await getCampaigns();
      setCampaigns(res.data || []);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleCreateFeedback = async () => {
    try {
      await createFeedback(newFeedback);
      setNewFeedback({ customerId: '', rating: 5, comment: '' });
      setShowCreateFeedback(false);
      // Refresh feedbacks
      const res = await getFeedbacks();
      setFeedbacks(res.data || []);
    } catch (error) {
      console.error('Error creating feedback:', error);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      await createCustomer(newCustomer);
      setNewCustomer({ name: '', phone: '', email: '', preferences: '', membershipTier: 'Bronze' });
      setShowCreateCustomer(false);
      // Refresh customers
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  if (showHistory && selectedCustomer) {
    const stats = getCustomerStats(selectedCustomer);

    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Customers
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {selectedCustomer.name}'s Profile
          </h2>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              KES {stats.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Items Purchased</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalItems}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Count</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.visitCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Loyalty Points</h3>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {selectedCustomer.loyaltyPoints || 0}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Membership Tier</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedCustomer.membershipTier === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                selectedCustomer.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                selectedCustomer.membershipTier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              }`}>
                {selectedCustomer.membershipTier}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Visit</label>
              <p className="text-gray-900 dark:text-gray-100">
                {stats.lastVisit ? stats.lastVisit.toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Spent</label>
              <p className="text-gray-900 dark:text-gray-100">KES {selectedCustomer.totalSpent?.toLocaleString() || '0'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedCustomer.preferences || 'None specified'}</p>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Purchase History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerHistory.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(sale.createdAt || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {sale.product?.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {sale.quantity}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        KES {sale.total.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {customerHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No purchase history found
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Customer Management</h2>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'feedback'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'offers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Offers
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'customers' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customers</h3>
            <button
              onClick={() => setShowCreateCustomer(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Customer
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No customers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Membership</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Total Spent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Visit Count</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Loyalty Points</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {customers.map(c => {
                    const stats = getCustomerStats(c);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{c.phone}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            c.membershipTier === 'Platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            c.membershipTier === 'Gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            c.membershipTier === 'Silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}>
                            {c.membershipTier || 'Bronze'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          KES {(c.totalSpent || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {stats.visitCount}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            {c.loyaltyPoints || 0} pts
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => viewCustomerHistory(c)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View History
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Marketing Campaigns</h3>
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Target Tiers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 text-sm">{c.name}</td>
                    <td className="px-4 py-3 text-sm">{c.type}</td>
                    <td className="px-4 py-3 text-sm">{c.targetTiers || 'All'}</td>
                    <td className="px-4 py-3 text-sm">{c.sentAt ? 'Sent' : 'Draft'}</td>
                    <td className="px-4 py-3 text-sm">
                      {!c.sentAt && (
                        <button
                          onClick={() => sendCampaign(c.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customer Feedback</h3>
            <button
              onClick={() => setShowCreateFeedback(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Feedback
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Comment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {feedbacks.map(f => (
                  <tr key={f.id}>
                    <td className="px-4 py-3 text-sm">{f.customer?.name}</td>
                    <td className="px-4 py-3 text-sm">{f.rating}/5</td>
                    <td className="px-4 py-3 text-sm">{f.comment || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{new Date(f.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Automated Offers</h3>
            <div className="space-x-2">
              <button
                onClick={() => triggerBirthdayOffers()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Trigger Birthday Offers
              </button>
              <button
                onClick={() => triggerVIPOffers()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Trigger VIP Offers
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Discount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Expires</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {offers.map(o => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 text-sm">{o.customer?.name}</td>
                    <td className="px-4 py-3 text-sm">{o.type}</td>
                    <td className="px-4 py-3 text-sm">{o.description}</td>
                    <td className="px-4 py-3 text-sm">{o.discountPercent}%</td>
                    <td className="px-4 py-3 text-sm">{new Date(o.expiresAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">{o.isUsed ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Create Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="SMS">SMS</option>
                  <option value="Email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Tiers (comma-separated)</label>
                <input
                  type="text"
                  value={newCampaign.targetTiers}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetTiers: e.target.value })}
                  placeholder="Gold, Platinum"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateCampaign(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreateCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Customer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Membership Tier</label>
                <select
                  value={newCustomer.membershipTier}
                  onChange={(e) => setNewCustomer({ ...newCustomer, membershipTier: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</label>
                <textarea
                  value={newCustomer.preferences}
                  onChange={(e) => setNewCustomer({ ...newCustomer, preferences: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Boho, Accessories, Formal wear"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateCustomer(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Feedback Modal */}
      {showCreateFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Feedback</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
                <select
                  value={newFeedback.customerId}
                  onChange={(e) => setNewFeedback({ ...newFeedback, customerId: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                <select
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
                <textarea
                  value={newFeedback.comment}
                  onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateFeedback(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
