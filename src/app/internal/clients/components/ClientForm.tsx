"use client";

import { useState } from "react";
import type { ClientData } from "../types";

interface ClientFormProps {
    onSubmit: (data: Partial<ClientData>) => Promise<void>;
    users: Array<{ id: string; name: string | null; email: string }>;
    initialData?: ClientData;
    isLoading?: boolean;
    readOnly?: boolean;
    canEditStatus?: boolean;
}

export function ClientForm({
    onSubmit,
    users,
    initialData,
    isLoading = false,
    readOnly = false,
    canEditStatus = false,
}: ClientFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        companyName: initialData?.companyName || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        website: initialData?.website || "",
        lifecycleStatus: initialData?.lifecycleStatus || "LEAD",
        weightage: initialData?.weightage || "REGULAR",
        relationshipLevel: initialData?.relationshipLevel || "WEAK",
        leadScore: initialData?.leadScore || "",
        expectedValue: initialData?.expectedValue || "",
        source: initialData?.source || "Other",
        ownerId: initialData?.ownerId || "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.currentTarget;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "number"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Convert numeric strings to numbers/null as needed
        const dataToSubmit: Partial<ClientData> = {
            ...formData,
            leadScore: formData.leadScore === "" ? undefined : Number(formData.leadScore),
            expectedValue: formData.expectedValue === "" ? undefined : Number(formData.expectedValue),
        } as Partial<ClientData>;
        await onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={readOnly || isLoading}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Company Name *
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled={readOnly || isLoading}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !!initialData}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={readOnly || isLoading}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Website
                </label>
                <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={readOnly || isLoading}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                />
            </div>

            {!initialData && (
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Owner *
                    </label>
                    <select
                        name="ownerId"
                        value={formData.ownerId}
                        onChange={handleChange}
                        disabled={readOnly || isLoading}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        required
                    >
                        <option value="">Select an owner</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name || user.email}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Lifecycle Status
                    </label>
                    <select
                        name="lifecycleStatus"
                        value={formData.lifecycleStatus}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="LEAD">Lead</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PAST">Past</option>
                        <option value="LOST">Lost</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Weightage
                    </label>
                    <select
                        name="weightage"
                        value={formData.weightage}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="VIP">VIP</option>
                        <option value="REGULAR">Regular</option>
                        <option value="ONE_TIME">One Time</option>
                        <option value="LOW_PRIORITY">Low Priority</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Relationship Level
                    </label>
                    <select
                        name="relationshipLevel"
                        value={formData.relationshipLevel}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="WEAK">Weak</option>
                        <option value="WARM">Warm</option>
                        <option value="STRONG">Strong</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Source
                    </label>
                    <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="Referral">Referral</option>
                        <option value="Website">Website</option>
                        <option value="Cold_outreach">Cold Outreach</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Lead Score
                    </label>
                    <input
                        type="number"
                        name="leadScore"
                        value={formData.leadScore}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Expected Value
                    </label>
                    <input
                        type="number"
                        name="expectedValue"
                        value={formData.expectedValue}
                        onChange={handleChange}
                        disabled={readOnly || isLoading || !canEditStatus}
                        className="w-full px-3 py-2 border border-gray-400 rounded-lg disabled:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
                        step="0.01"
                        min="0"
                    />
                </div>
            </div>

            {!readOnly && (
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            )}
        </form>
    );
}
