'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Clock,
  Mail,
  Phone,
  Building2,
  Tag,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface EnquiryItem {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  categoryId?: {
    _id: string;
    name: string;
  };
  categoryName?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Closed';
  internalNotes?: string;
  sourcePage?: string;
  createdAt: string;
}

function EnquiriesContent() {
  const searchParams = useSearchParams();
  const initialOpenId = searchParams.get('open');

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusCounts, setStatusCounts] = useState({ New: 0, 'In Progress': 0, Closed: 0 });

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [editStatus, setEditStatus] = useState<'New' | 'In Progress' | 'Closed'>('New');
  const [editNotes, setEditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<EnquiryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        if (data.statusCounts) {
          setStatusCounts(data.statusCounts);
        }
        if (initialOpenId && !selectedEnquiry) {
          const match = (data.enquiries || []).find((e: EnquiryItem) => e._id === initialOpenId);
          if (match) openDetailModal(match);
        }
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to fetch enquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const openDetailModal = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.internalNotes || '');
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update enquiry');

      setFeedback({ type: 'success', message: 'Enquiry updated successfully.' });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete enquiry');

      setFeedback({ type: 'success', message: 'Enquiry deleted successfully.' });
      setDeleteTarget(null);
      if (selectedEnquiry?._id === deleteTarget._id) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Corporate Relations
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Business Enquiry Inbox
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review institutional procurement requirements, update pipeline status, and maintain private notes.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Status Counters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'New' ? '' : 'New')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'New'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white border-stone-200 text-stone-800 hover:border-amber-400'
          }`}
        >
          <div className="text-xs uppercase font-bold tracking-wider opacity-80">New Enquiries</div>
          <div className="text-2xl font-extrabold mt-1">{statusCounts.New}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'In Progress' ? '' : 'In Progress')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'In Progress'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md'
              : 'bg-white border-stone-200 text-stone-800 hover:border-blue-400'
          }`}
        >
          <div className="text-xs uppercase font-bold tracking-wider opacity-80">In Progress</div>
          <div className="text-2xl font-extrabold mt-1">{statusCounts['In Progress']}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'Closed' ? '' : 'Closed')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'Closed'
              ? 'bg-stone-800 text-white border-stone-900 shadow-md'
              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400'
          }`}
        >
          <div className="text-xs uppercase font-bold tracking-wider opacity-80">Closed / Completed</div>
          <div className="text-2xl font-extrabold mt-1">{statusCounts.Closed}</div>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchEnquiries();
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by submitter, company, email or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Enquiries...</p>
          </div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Submitter & Organization</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Interest / Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{enq.name}</span>
                      {enq.companyName && (
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{enq.companyName}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[11px] text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{enq.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{enq.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        <Tag className="w-3 h-3 text-brand-orange" />
                        <span>{enq.categoryId?.name || enq.categoryName || 'General Corporate'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openDetailModal(enq)}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-brand-orange bg-stone-100 hover:bg-orange-50 rounded transition-colors"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(enq)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-stone-300" />
            <p className="text-sm font-semibold text-stone-700">No enquiries match criteria</p>
            <p className="text-xs text-stone-400">All inbound procurement forms appear here.</p>
          </div>
        )}
      </div>

      {/* Enquiry Detail & Pipeline Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  Corporate Requirement Review
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                  Enquiry from {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Submitter Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Submitter Name
                </span>
                <span className="font-bold text-stone-900 text-sm">{selectedEnquiry.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Company / Academy
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  {selectedEnquiry.companyName || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Official Email
                </span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-bold text-brand-orange hover:underline text-sm"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Telephone Number
                </span>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="font-bold text-brand-orange hover:underline text-sm"
                >
                  {selectedEnquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Interested Category
                </span>
                <span className="font-bold text-stone-900">
                  {selectedEnquiry.categoryId?.name || selectedEnquiry.categoryName || 'General'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase text-[10px]">
                  Submitted Date
                </span>
                <span className="font-bold text-stone-900">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Original Message */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-orange" />
                <span>Original Requirement Specification</span>
              </h4>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed font-sans">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Pipeline Status Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Update Pipeline Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Private Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Private internal notes (never visible to submitter)..."
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(selectedEnquiry);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatusAndNotes}
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm disabled:opacity-60"
                >
                  {isUpdating ? 'Saving...' : 'Save Pipeline Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Delete Business Enquiry</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete the enquiry from <strong>{deleteTarget.name}</strong>? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEnquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-stone-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading Enquiries...</p>
        </div>
      }
    >
      <EnquiriesContent />
    </Suspense>
  );
}

