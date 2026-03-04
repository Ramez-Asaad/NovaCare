"use client";

import { useState } from "react";
import { FileText, Download, Upload, Search, Filter, Calendar, Tag, Eye, Share2, MoreVertical, Plus, Folder, File, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { cn } from "@/lib/utils";

const recordCategories = [
  { id: "all", label: "All Records", count: 24 },
  { id: "diagnosis", label: "Diagnoses", count: 5 },
  { id: "lab", label: "Lab Results", count: 8 },
  { id: "imaging", label: "Imaging", count: 4 },
  { id: "notes", label: "Clinical Notes", count: 7 },
];

const medicalRecords = [
  {
    id: 1,
    title: "Comprehensive Blood Panel",
    type: "lab",
    date: "2026-01-15",
    provider: "Quest Diagnostics",
    status: "reviewed",
    tags: ["Blood Work", "Annual"],
  },
  {
    id: 2,
    title: "Type 2 Diabetes - Initial Diagnosis",
    type: "diagnosis",
    date: "2025-11-20",
    provider: "Dr. Sarah Johnson",
    status: "active",
    tags: ["Chronic Condition", "Endocrinology"],
  },
  {
    id: 3,
    title: "Chest X-Ray Report",
    type: "imaging",
    date: "2025-12-05",
    provider: "Imaging Center",
    status: "reviewed",
    tags: ["Radiology", "Routine"],
  },
  {
    id: 4,
    title: "Follow-up Consultation Notes",
    type: "notes",
    date: "2026-01-10",
    provider: "Dr. Michael Chen",
    status: "pending",
    tags: ["Cardiology", "Follow-up"],
  },
  {
    id: 5,
    title: "Echocardiogram Results",
    type: "imaging",
    date: "2025-12-18",
    provider: "Heart Center",
    status: "reviewed",
    tags: ["Cardiology", "Diagnostic"],
  },
  {
    id: 6,
    title: "HbA1c Test Results",
    type: "lab",
    date: "2026-01-08",
    provider: "LabCorp",
    status: "reviewed",
    tags: ["Diabetes", "Monitoring"],
  },
];

const typeIcons: Record<string, any> = {
  lab: FileText,
  diagnosis: Tag,
  imaging: File,
  notes: Folder,
};

const typeColors: Record<string, string> = {
  lab: "bg-purple-100 dark:bg-purple-900/50 text-purple-600",
  diagnosis: "bg-accent-100 dark:bg-accent-900/50 text-accent",
  imaging: "bg-primary-100 dark:bg-primary-900/50 text-primary",
  notes: "bg-secondary-100 dark:bg-secondary-900/50 text-secondary",
};

export default function RecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(typeof medicalRecords)[0] | null>(null);

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesCategory = selectedCategory === "all" || record.type === selectedCategory;
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleViewRecord = (record: typeof medicalRecords[0]) => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Medical Records</h2>
          <p className="text-text-muted dark:text-gray-400">Patient health records and documents</p>
        </div>
        <Button leftIcon={<Upload className="w-5 h-5" />} onClick={() => setUploadModalOpen(true)}>
          Upload Record
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-4 pt-0">
                {recordCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all",
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "text-text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <span>{category.label}</span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium",
                        selectedCategory === category.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="mt-4">
            <CardContent className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Folder className="w-8 h-8 text-text-muted dark:text-gray-400" />
              </div>
              <h4 className="font-semibold text-text-primary dark:text-white mb-1">Storage Used</h4>
              <p className="text-sm text-text-muted dark:text-gray-400 mb-4">2.4 GB of 5 GB</p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Records List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search records by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
              Filter
            </Button>
            <Button className="dark:text-white dark:hover:text-text-primary" variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
              Date Range
            </Button>
          </div>

          {/* Records Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredRecords.map((record) => {
              const TypeIcon = typeIcons[record.type];
              return (
                <Card key={record.id} variant="elevated" className="hover:shadow-elevated transition-all">
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", typeColors[record.type])}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={record.status === "active" ? "danger" : record.status === "pending" ? "warning" : "success"}>
                          {record.status}
                        </Badge>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <MoreVertical className="w-4 h-4 text-text-muted dark:text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-text-primary dark:text-white mb-1 line-clamp-2">{record.title}</h3>
                    <p className="text-sm text-text-muted dark:text-gray-400 mb-3">{record.provider}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {record.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-text-secondary dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-text-muted dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewRecord(record)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-text-muted dark:text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Download">
                          <Download className="w-4 h-4 text-text-muted dark:text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Share">
                          <Share2 className="w-4 h-4 text-text-muted dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-text-muted dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">No records found</h3>
              <p className="text-text-muted dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* View Record Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} size="lg">
        <ModalHeader>{selectedRecord?.title}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", typeColors[selectedRecord?.type || "lab"])}>
                {selectedRecord && <FileText className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-muted dark:text-gray-400">Provider</p>
                <p className="font-medium text-text-primary dark:text-white">{selectedRecord?.provider}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-gray-400">Date</p>
                <p className="font-medium text-text-primary dark:text-white">
                  {selectedRecord && new Date(selectedRecord.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="min-h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <p className="text-text-muted dark:text-gray-400">Document preview would appear here</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedRecord?.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Download
          </Button>
          <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} size="lg">
        <ModalHeader>Upload Medical Record</ModalHeader>
        <ModalBody className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-text-primary dark:text-white mb-2">Drag & Drop Files</h4>
            <p className="text-sm text-text-muted dark:text-gray-400 mb-4">or click to browse</p>
            <Button variant="outline">Select Files</Button>
          </div>
          <Input label="Document Title" placeholder="Enter document title" />
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-2">Record Type</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
              <option value="lab">Lab Results</option>
              <option value="imaging">Imaging</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="notes">Clinical Notes</option>
            </select>
          </div>
          <Input label="Tags" placeholder="e.g., Cardiology, Annual Checkup" />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setUploadModalOpen(false)}>Upload Record</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
