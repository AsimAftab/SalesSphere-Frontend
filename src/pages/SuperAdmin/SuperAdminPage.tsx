// This file is deprecated - functionality moved to OrganizationListPage
// import { useState, useEffect } from "react";
// import {
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/UI/SuperadminComponents/card";
// import { StatusBadge } from '../../components/UI/statusBadge/statusBadge';
// import CustomButton from "../../components/UI/Button/Button";
// import { Input } from "../../components/UI/SuperadminComponents/input";
// import { Tabs, TabsList, TabsTrigger } from "../../components/UI/SuperadminComponents/tabs";
// import { OrganizationDetailsModal } from "../../components/modals/superadmin/OrganizationDetailsModal";
// import { OrganizationFormModal } from "../../components/modals/superadmin/OrganizationFormModal";
// import { SuperAdminSettingsModal } from "../../components/modals/superadmin/SuperAdminSettingsModal";
// import { ActivityLogModal } from "../../components/modals/superadmin/ActivityLogModal";
// import SuperAdminStatCard from "../../components/cards/SuperAdminCards/SuperAdminStatCard";
// import logo from "../../assets/images/logo-c.svg";
// import {
//   addOrganization,
//   updateOrganization,
// } from "../../api/SuperAdmin/organizationService";
// import type {
//   Organization,
//   UpdateOrganizationRequest
// } from "../../api/SuperAdmin/organizationService";
// import { addSystemUser } from "../../api/SuperAdmin/systemUserService";
// import type { SystemUser } from "../../api/SuperAdmin/systemUserService";
// import { getSystemOverview, type OrganizationFromAPI, type SystemUserFromAPI } from "../../api/SuperAdmin/systemOverviewService";
// import { useNavigate } from "react-router-dom";
// import { AddSystemUserModal } from "../../components/modals/superadmin/AddSystemUserModal";
// import { CustomPlanModal } from "../../components/modals/superadmin/CustomPlanModal";
// import toast from "react-hot-toast";
// import { subscriptionPlanService, type SubscriptionPlan } from "../../api/SuperAdmin/subscriptionPlanService";
// import { useAuth } from "../../api/authService";
// import { logout } from "../../api/authService";

// export default function SuperAdminPage() {
//   const navigate = useNavigate();
//   const { user: currentUser, isSuperAdmin } = useAuth();

//   const [organizations, setOrganizations] = useState<Organization[]>([]);
//   const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // System Users state
//   const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
//   const [systemUsersLoading, setSystemUsersLoading] = useState(true);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
//   const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   // Plans state
//   // Plans state
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

//   // Helper function to get animation delay class based on index
//   const getAnimationDelayClass = (baseDelay: number, index: number, increment: number = 0.1): string => {
//     const delayMs = Math.round((baseDelay + (index * increment)) * 1000);
//     // Map to closest available delay class
//     if (delayMs <= 375) return 'animation-delay-350';
//     if (delayMs <= 450) return 'animation-delay-400';
//     if (delayMs <= 550) return 'animation-delay-500';
//     if (delayMs <= 650) return 'animation-delay-600';
//     if (delayMs <= 750) return 'animation-delay-700';
//     if (delayMs <= 850) return 'animation-delay-800';
//     if (delayMs <= 950) return 'animation-delay-900';
//     return 'animation-delay-1000';
//   };

//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

//   const handlePlanClick = (plan: SubscriptionPlan) => {
//     setSelectedPlan(plan);
//     setIsCustomPlanModalOpen(true);
//   };

//   // Filter out the current logged-in user from the badge list display
//   const displaySystemUsers = systemUsers.filter(user => user.id !== currentUser?._id && user._id !== currentUser?._id);

//   // Fetch organizations and system users on mount
//   useEffect(() => {
//     fetchSystemOverview();
//     fetchPlans();
//   }, []);

//   // Handle escape key for logout confirmation dialog
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape' && showLogoutConfirm) {
//         setShowLogoutConfirm(false);
//       }
//     };

//     if (showLogoutConfirm) {
//       document.addEventListener('keydown', handleEscape);
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [showLogoutConfirm]);

//   // Helper function to transform OrganizationFromAPI to Organization
//   const transformOrganization = (org: OrganizationFromAPI): Organization => {
//     const safelyFormatDate = (dateString: string | undefined): string => {
//       try {
//         if (!dateString) return new Date().toISOString().split('T')[0];
//         const date = new Date(dateString);
//         return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
//       } catch (e) {
//         return new Date().toISOString().split('T')[0];
//       }
//     };

//     return {
//       id: org.id || org._id,
//       name: org.name || 'Unnamed Org',
//       address: org.address || 'No Address',
//       owner: org.owner?.name || 'Unknown Owner',
//       ownerEmail: org.owner?.email || 'No Email',
//       phone: org.phone || '',
//       panVat: org.panVatNumber || '',
//       latitude: 0, // Not provided by API
//       longitude: 0, // Not provided by API
//       addressLink: org.address ? `https://maps.google.com/?q=${org.address}` : '',
//       status: org.isActive ? "Active" : "Inactive",
//       users: [{
//         id: org.owner?.id || org.owner?._id || 'unknown',
//         name: org.owner?.name || 'Unknown',
//         email: org.owner?.email || '',
//         role: "Owner",
//         emailVerified: true,
//         isActive: org.isActive,
//         lastActive: "Never"
//       }],
//       createdDate: safelyFormatDate(org.subscriptionStartDate),
//       emailVerified: true,
//       subscriptionStatus: org.isSubscriptionActive ? "Active" : "Expired",
//       subscriptionExpiry: safelyFormatDate(org.subscriptionEndDate),
//     };
//   };

//   // Helper function to transform SystemUserFromAPI to SystemUser
//   const transformSystemUser = (user: SystemUserFromAPI): SystemUser => {
//     return {
//       id: user.id || user._id,
//       _id: user._id,
//       name: user.name || 'Unknown User',
//       email: user.email || '',
//       role: user.role || 'User',
//       phone: user.phone || '',
//       position: '', // Not provided by API
//       dob: '', // Not provided by API
//       dateOfBirth: '', // Not provided by API
//       pan: '', // Not provided by API
//       panNumber: '', // Not provided by API
//       citizenship: '', // Not provided by API
//       citizenshipNumber: '', // Not provided by API
//       gender: '', // Not provided by API
//       location: user.address || '',
//       address: user.address || '',
//       photoPreview: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&size=300&background=3b82f6&color=fff`,
//       avatarUrl: '',
//       createdDate: user.createdAt,
//       dateJoined: user.createdAt,
//       lastActive: "Never", // Not provided by API
//       isActive: user.isActive,
//       createdAt: user.createdAt,
//       updatedAt: user.createdAt,
//     };
//   };

//   const fetchSystemOverview = async () => {
//     try {
//       setLoading(true);
//       setSystemUsersLoading(true);
//       setError(null);

//       const overview = await getSystemOverview();

//       // Transform and set organizations
//       const transformedOrgs = (overview.organizations?.list || []).map(transformOrganization);
//       setOrganizations(transformedOrgs);

//       // Transform and set system users
//       const transformedUsers = (overview.systemUsers?.list || []).map(transformSystemUser);
//       setSystemUsers(transformedUsers);

//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to fetch system overview";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//       setSystemUsersLoading(false);
//     }
//   };

//   const handleOrgClick = (org: Organization) => {
//     setSelectedOrg(org);
//     setIsDetailsModalOpen(true);
//   };

//   const handleOrgUpdate = async (updatedOrg: Organization, source?: string) => {
//     try {
//       // If source is "activate" or "deactivate", skip API call - endpoint already updated backend
//       if (source === "activate" || source === "deactivate") {
//         // Just update local state
//         setOrganizations(orgs =>
//           orgs.map(org => org.id === updatedOrg.id ? updatedOrg : org)
//         );
//         setSelectedOrg(updatedOrg);
//         return;
//       }

//       // For actual organization detail updates, call the API
//       const updateData: UpdateOrganizationRequest = {
//         id: updatedOrg.id,
//         name: updatedOrg.name,
//         address: updatedOrg.address,
//         owner: updatedOrg.owner,
//         ownerEmail: updatedOrg.ownerEmail,
//         phone: updatedOrg.phone,
//         panVat: updatedOrg.panVat,
//         latitude: updatedOrg.latitude,
//         longitude: updatedOrg.longitude,
//         addressLink: updatedOrg.addressLink,
//         status: updatedOrg.status,
//         emailVerified: updatedOrg.emailVerified,
//         subscriptionStatus: updatedOrg.subscriptionStatus,
//         subscriptionExpiry: updatedOrg.subscriptionExpiry,
//         deactivationReason: updatedOrg.deactivationReason,
//         deactivatedDate: updatedOrg.deactivatedDate,
//         users: updatedOrg.users
//       };

//       const updated = await updateOrganization(updatedOrg.id, updateData);
//       setOrganizations(orgs =>
//         orgs.map(org => org.id === updated.id ? updated : org)
//       );
//       setSelectedOrg(updated);
//       toast.success(`Organization "${updated.name}" updated successfully!`);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to update organization";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     }
//   };

//   /* replaced AddOrganizationModal with generic handle */
//   const handleAddOrganization = async (newOrg: any) => {
//     try {
//       const organization = await addOrganization(newOrg);
//       setOrganizations([...organizations, organization]);
//       setIsAddModalOpen(false);
//       toast.success(`Organization "${newOrg.name}" added successfully!`);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to add organization";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     }
//   };

//   const handleAddSystemUser = async (newUser: {
//     name: string;
//     email: string;
//     phone: string;
//     role: "superadmin" | "Developer";
//     position: string;
//     dob?: string;
//     citizenship?: string;
//     gender?: string;
//     location?: string;
//   }) => {
//     try {
//       // Create new user request for backend (using new endpoint that auto-generates password)
//       const createUserRequest = {
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         phone: newUser.phone,
//         // Optional fields
//         dateOfBirth: newUser.dob,
//         citizenshipNumber: newUser.citizenship,
//         gender: newUser.gender,
//         address: newUser.location,
//       };

//       // Call backend API to create user (new endpoint)
//       const createdUser = await addSystemUser(createUserRequest);

//       // Update local state with new user
//       setSystemUsers([...systemUsers, createdUser]);
//       setShowAddUserModal(false);

//       // Show success message
//       toast.success(`System user "${newUser.name}" added successfully! Verification email sent to ${newUser.email}`);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to add system user";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     }
//   };


//   const fetchPlans = async () => {
//     try {
//       const response = await subscriptionPlanService.getAll();
//       setPlans(response.data.data);
//     } catch (err: any) {
//       console.error("Failed to fetch plans", err);
//       toast.error("Failed to load subscription plans");
//     }
//   };

//   const handleCreateCustomPlan = async (planData: Partial<SubscriptionPlan>) => {
//     try {
//       if (selectedPlan) {
//         // Editing existing plan
//         const response = await subscriptionPlanService.update(selectedPlan._id, planData);
//         setPlans(plans.map(p => p._id === selectedPlan._id ? response.data.data : p));
//         toast.success(`Plan "${response.data.data.name}" updated successfully!`);
//       } else {
//         // Creating new plan
//         const response = await subscriptionPlanService.create(planData);
//         setPlans([...plans, response.data.data]);
//         toast.success(`Custom plan "${response.data.data.name}" created successfully!`);
//       }
//       setIsCustomPlanModalOpen(false);
//       setSelectedPlan(null);
//     } catch (err: any) {
//       console.error("Failed to save plan", err);
//       toast.error(err.response?.data?.message || err.message || "Failed to save plan");
//     }
//   };



//   const handleLogout = () => {
//     setShowLogoutConfirm(false);
//     toast.success("Logging out...");
//     setTimeout(() => {
//       logout();
//     }, 500);
//   };

//   const filteredOrgs = organizations.filter(org => {
//     const orgName = org.name || '';
//     const ownerName = org.owner || '';
//     const matchesSearch = orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ownerName.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesTab = activeTab === "all" ||
//       (activeTab === "active" && org.status === "Active") ||
//       (activeTab === "inactive" && org.status === "Inactive");
//     return matchesSearch && matchesTab;
//   });

//   const stats = {
//     total: organizations.length,
//     active: organizations.filter(o => o.status === "Active").length,
//     inactive: organizations.filter(o => o.status === "Inactive").length,
//     expired: organizations.filter(o => o.subscriptionStatus === "Expired").length
//   };

//   // Helper function to get remaining days info
//   const getRemainingDaysInfo = (expiryDate: string): { text: string; color: string } => {
//     if (!expiryDate) return { text: "No Expiry", color: "text-gray-500" };
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const diffTime = expiry.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays < 0) {
//       return {
//         text: "Expired",
//         color: "text-red-600 border-red-200 bg-red-50"
//       };
//     } else if (diffDays < 7) {
//       return {
//         text: `${diffDays} days left`,
//         color: "text-orange-600 border-orange-200 bg-orange-50"
//       };
//     } else {
//       return {
//         text: `${diffDays} days left`,
//         color: "text-blue-600 border-blue-200 bg-blue-50"
//       };
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
//         <Card className="p-8">
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             <p className="text-slate-600">Loading organizations...</p>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
//       <div className="max-w-7xl mx-auto space-y-5">

//         {/* Logo and Brand with Profile */}
//         <div className="flex items-center justify-between">
//           {/* ... existing header logic */}
//           <div className="flex items-center gap-3 ">
//             <img className="h-16 w-auto" src={logo} alt="SalesSphere" />
//             <span className=" text-4xl font-bold">
//               <span className="text-secondary">Sales</span>
//               <span className="text-gray-800">Sphere</span>
//             </span>
//           </div>

//           {/* Current User Profile and Settings */}
//           {currentUser && (currentUser._id || currentUser.id) && (
//             <div className="flex items-center gap-3">
//               {/* Activity Log Button */}
//               <CustomButton
//                 variant="outline"
//                 onClick={() => setIsActivityLogModalOpen(true)}
//                 className="px-3 py-2"
//                 title="Activity Logs"
//               >
//                 <Activity className="w-5 h-5" />
//               </CustomButton>

//               {/* Settings Button */}
//               <CustomButton
//                 variant="outline"
//                 onClick={() => setIsSettingsModalOpen(true)}
//                 className="px-3 py-2"
//                 title="Settings"
//               >
//                 <UserCog className="w-5 h-5" />
//               </CustomButton>

//               {/* Logout Button */}
//               <CustomButton
//                 variant="danger"
//                 onClick={() => setShowLogoutConfirm(true)}
//                 className="px-3 py-2"
//                 title="Logout"
//               >
//                 <LogOut className="w-5 h-5" />
//               </CustomButton>

//               {/* User Profile */}
//               <div
//                 onClick={() => navigate(`/system-admin/users/${currentUser._id || currentUser.id}`)}
//                 className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-md border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-200">
//                     {currentUser.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('') : '?'}
//                   </div>
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-slate-900">{currentUser.name || 'User'}</p>
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === "superadmin" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}
//                     >
//                       {currentUser.role || 'User'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                 <div className="flex-1">
//                   <p className="text-red-900 font-medium">Error</p>
//                   <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//                 <CustomButton
//                   variant="outline"
//                   onClick={fetchSystemOverview}
//                   className="text-sm py-2 px-4"
//                 >
//                   Retry
//                 </CustomButton>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Header */}
//         <div className="flex items-start justify-between">
//           <div className="ml-4">
//             <h1 className="text-slate-900 flex items-center gap-3 mb-2">
//               <Shield className="w-8 h-8 text-blue-600" />
//               Super Admin Dashboard
//             </h1>
//             <p className="text-slate-600">
//               Manage organizations, users, and system access
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <CustomButton variant="primary" onClick={() => setIsCustomPlanModalOpen(true)}>
//               Custom Plan
//             </CustomButton>
//             <CustomButton onClick={() => setIsAddModalOpen(true)} variant="primary">
//               Add Organization
//             </CustomButton>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <SuperAdminStatCard
//             title="Total Organizations"
//             value={stats.total}
//             valueColor="text-slate-900"
//             animationDelay="0s"
//           />
//           <SuperAdminStatCard
//             title="Active"
//             value={stats.active}
//             valueColor="text-green-600"
//             animationDelay="0.1s"
//           />
//           <SuperAdminStatCard
//             title="Inactive/Deactivated"
//             value={stats.inactive}
//             valueColor="text-slate-500"
//             animationDelay="0.2s"
//           />
//           <SuperAdminStatCard
//             title="Subscription Expired"
//             value={stats.expired}
//             valueColor="text-red-600"
//             animationDelay="0.3s"
//           />
//         </div>

//         {/* Subscription Plans Section */}
//         <Card className="animate-fade-in animation-delay-300 shadow-md">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
//                   <Shield className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-slate-900">Subscription Plans</CardTitle>
//                   <CardDescription>Manage available plans and custom offerings</CardDescription>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-500 text-blue-700">
//                   {plans.length} Active Plans
//                 </span>
//                 <CustomButton variant="primary" onClick={() => setIsCustomPlanModalOpen(true)}>
//                   Create Plan
//                 </CustomButton>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {plans.map((plan, index) => (
//                 <div
//                   key={plan._id}
//                   onClick={() => handlePlanClick(plan)}
//                   className={`group relative bg-white rounded-xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-6 cursor-pointer overflow-hidden ${getAnimationDelayClass(0.2, index)}`}
//                 >
//                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

//                   <div className="relative">
//                     <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
//                     <div className="flex items-baseline gap-1 mb-4">
//                       <span className="text-2xl font-bold text-blue-600">
//                         {plan.price.currency === 'INR' ? '₹' : plan.price.currency === 'EUR' ? '€' : '$'}
//                         {plan.price.amount}
//                       </span>
//                       <span className="text-sm text-slate-500 font-medium">/{plan.price.billingCycle}</span>
//                     </div>

//                     <div className="space-y-3 mb-6">
//                       <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
//                         <Users className="w-4 h-4 text-blue-500" />
//                         <span>Up to <strong>{plan.maxEmployees}</strong> Employees</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
//                         <Activity className="w-4 h-4 text-green-500" />
//                         <span><strong>{plan.enabledModules.length}</strong> Modules Included</span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
//                       <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">
//                         ACTIVE
//                       </span>
//                       <span className="text-xs text-slate-400 ml-auto">
//                         Created recently
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* System Users Section */}
//         <Card className="animate-fade-in animation-delay-350 shadow-md">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
//                   <UserCog className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-slate-900">System Users</CardTitle>
//                   <CardDescription>Manage super admins and developers</CardDescription>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-purple-500 text-purple-700">
//                   {displaySystemUsers.length} {displaySystemUsers.length === 1 ? 'User' : 'Users'}
//                 </span>
//                 {isSuperAdmin && (
//                   <CustomButton
//                     variant="primary"
//                     onClick={() => setShowAddUserModal(true)}
//                   >
//                     Add User
//                   </CustomButton>
//                 )}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {systemUsersLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
//               </div>
//             ) : displaySystemUsers.length === 0 ? (
//               <div className="text-center py-8 text-slate-500">
//                 <p>No other system users found.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {displaySystemUsers.map((user, index) => (
//                   <div
//                     key={user.id}
//                     onClick={() => navigate(`/system-admin/users/${user.id}`)}
//                     className={`bg-gradient-to-br p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer animate-fade-in ${getAnimationDelayClass(0.4, index)} ${user.isActive
//                       ? 'from-slate-50 to-slate-100 border-slate-200 hover:border-purple-300 hover:shadow-lg'
//                       : 'from-red-50 to-red-100 border-red-200 opacity-75'
//                       }`}
//                   >
//                     <div className="flex flex-col items-center text-center">
//                       <div
//                         className={`w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold mb-3 ring-2 ${user.isActive
//                           ? 'from-purple-400 to-purple-600 ring-purple-200'
//                           : 'from-gray-400 to-gray-600 ring-gray-200'
//                           }`}
//                       >
//                         {(user.name || '?').split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <h3 className="font-semibold text-slate-900 mb-1">{user.name}</h3>
//                       <div className="flex items-center gap-2 mb-2">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "superadmin" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}
//                         >
//                           {user.role}
//                         </span>
//                         {!user.isActive && (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                             Inactive
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs text-slate-600 mb-1">{user.email}</p>
//                       <p className="text-xs text-slate-500">Last active: {user.lastActive}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Search and Filters */}
//         <Card className="animate-fade-in animation-delay-400 shadow-md">
//           <CardHeader className="py-6">
//             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mx-auto max-w-6xl px-4">
//               <div className="relative w-full sm:flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <Input
//                   placeholder="Search organizations or owners..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 w-full h-11 text-base"
//                 />
//               </div>
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//                 <TabsList className="grid w-full grid-cols-3 sm:w-auto">
//                   <TabsTrigger value="all">All</TabsTrigger>
//                   <TabsTrigger value="active">Active</TabsTrigger>
//                   <TabsTrigger value="inactive">Inactive</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Organizations Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredOrgs.map((org, index) => (
//             <Card
//               key={org.id}
//               className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200 animate-fade-in ${getAnimationDelayClass(0.5, index)}`}
//               onClick={() => handleOrgClick(org)}
//             >
//               <CardHeader>
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
//                       <Building2 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-slate-900">{org.name}</CardTitle>
//                       <p className="text-slate-500 text-sm">{org.id}</p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-2 items-end">
//                     <StatusBadge status={org.status} />
//                     {org.subscriptionStatus === "Expired" && (
//                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
//                         Subscription Expired
//                       </span>
//                     )}
//                     {!org.emailVerified && (
//                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                         <Mail className="w-3 h-3 mr-1" />
//                         Pending
//                       </span>
//                     )}
//                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
//                       {getRemainingDaysInfo(org.subscriptionExpiry).text}
//                     </span>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex items-start gap-2 text-sm">
//                     <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
//                     <span className="text-slate-600">{org.address}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                     <span className="text-slate-600">{org.owner}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                     <span className="text-slate-600 truncate">{org.ownerEmail}</span>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-slate-200">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Users className="w-4 h-4 text-slate-400" />
//                       <span className="text-slate-600 text-sm">{org.users.length} Users</span>
//                     </div>
//                     <div className="flex -space-x-2">
//                       {org.users.slice(0, 3).map((user) => (
//                         <div
//                           key={user.id}
//                           className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-white text-xs"
//                           title={user.name}
//                         >
//                           {(user.name || '?').split(' ').map(n => n[0]).join('')}
//                         </div>
//                       ))}
//                       {org.users.length > 3 && (
//                         <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs">
//                           +{org.users.length - 3}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-2 text-xs text-slate-500">
//                     Created: {new Date(org.createdDate).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {
//           filteredOrgs.length === 0 && (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500">No organizations found</p>
//                 <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
//               </CardContent>
//             </Card>
//           )
//         }
//       </div>

//       {/* Modals */}
//       {
//         selectedOrg && (
//           <OrganizationDetailsModal
//             organization={selectedOrg}
//             isOpen={isDetailsModalOpen}
//             onClose={() => setIsDetailsModalOpen(false)}
//             onUpdate={handleOrgUpdate}
//           />
//         )
//       }
//       {
//         showAddUserModal && (
//           <AddSystemUserModal
//             isOpen={showAddUserModal}
//             onClose={() => setShowAddUserModal(false)}
//             onAdd={handleAddSystemUser}
//           />
//         )
//       }

//       <OrganizationFormModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//         onSave={handleAddOrganization}
//       />

//       <SuperAdminSettingsModal
//         isOpen={isSettingsModalOpen}
//         onClose={() => setIsSettingsModalOpen(false)}
//       />

//       <ActivityLogModal
//         isOpen={isActivityLogModalOpen}
//         onClose={() => setIsActivityLogModalOpen(false)}
//       />

//       {/* Logout Confirmation Dialog */}
//       <CustomPlanModal
//         isOpen={isCustomPlanModalOpen}
//         onClose={() => {
//           setIsCustomPlanModalOpen(false);
//           setSelectedPlan(null);
//         }}
//         onSubmit={handleCreateCustomPlan}
//         initialPlan={selectedPlan}
//       />

//       {
//         showLogoutConfirm && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowLogoutConfirm(false)}
//           >
//             <div
//               className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
//                   <LogOut className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
//                   <p className="text-sm text-slate-600">Are you sure you want to logout?</p>
//                 </div>
//               </div>
//               <div className="flex gap-3 justify-end mt-6">
//                 <CustomButton
//                   variant="outline"
//                   onClick={() => setShowLogoutConfirm(false)}
//                 >
//                   Cancel
//                 </CustomButton>
//                 <CustomButton
//                   variant="danger"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </CustomButton>
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </div >
//   );
// }
