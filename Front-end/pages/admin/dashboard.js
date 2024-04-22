import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminLayout from "@/layouts/AdminLayout";
import React from "react";

const Dashboard = () => {
  return (
    <AdminLayout>
      <AdminTopBar />
      <h2>Tableau de bord</h2>
    </AdminLayout>
  );
};

export default Dashboard;
