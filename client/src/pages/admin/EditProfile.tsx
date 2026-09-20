import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Trash } from 'lucide-react';
import { assetUrl } from '../../config/api';

const EditProfile = () => {
    const [formData, setFormData] = useState<any>({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        address: '',
        github: '',
        linkedin: '',
        twitter: '',
        skills: [],
        experience: [],
        portfolio: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.data && res.data.length > 0) {
                    const data = res.data[0];
                    setFormData({
                        ...data,
                        github: data.socialLinks?.github || '',
                        linkedin: data.socialLinks?.linkedin || '',
                        twitter: data.socialLinks?.twitter || '',
                        skills: data.skills || [],
                        experience: data.experience || [],
                        _id: data._id // Store ID
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillCategoryChange = (index: number, field: string, value: any) => {
        const newSkills = [...formData.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setFormData({ ...formData, skills: newSkills });
    };

    const handleSkillItemChange = (categoryIndex: number, itemIndex: number, value: string) => {
        const newSkills = [...formData.skills];
        const newItems = [...newSkills[categoryIndex].items];
        newItems[itemIndex] = value;
        newSkills[categoryIndex] = { ...newSkills[categoryIndex], items: newItems };
        setFormData({ ...formData, skills: newSkills });
    };

    const addSkillCategory = () => {
        setFormData({ ...formData, skills: [...formData.skills, { category: '', topPriority: false, items: [] }] });
    };

    const removeSkillCategory = (index: number) => {
        const newSkills = formData.skills.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const addSkillItem = (categoryIndex: number) => {
        const newSkills = [...formData.skills];
        newSkills[categoryIndex] = { ...newSkills[categoryIndex], items: [...(newSkills[categoryIndex].items || []), ''] };
        setFormData({ ...formData, skills: newSkills });
    };

    const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
        const newSkills = [...formData.skills];
        const newItems = newSkills[categoryIndex].items.filter((_: any, i: number) => i !== itemIndex);
        newSkills[categoryIndex] = { ...newSkills[categoryIndex], items: newItems };
        setFormData({ ...formData, skills: newSkills });
    };

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const newExperience = [...formData.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setFormData({ ...formData, experience: newExperience });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { title: '', company: '', duration: '', description: '' }]
        });
    };

    const removeExperience = (index: number) => {
        const newExperience = formData.experience.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, experience: newExperience });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        if (!formData._id) {
            setMessage('Save your profile at least once before uploading an image.');
            return;
        }

        const data = new FormData();
        data.append('image', file);

        setUploadingImage(true);
        setMessage('');

        try {
            const res = await axios.post(`/api/profile/${formData._id}/upload-image`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token') || ''
                }
            });

            setFormData({ ...formData, image: res.data.imageUrl });
            setMessage('Profile image uploaded successfully!');
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessage('Failed to upload image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const payload = {
                ...formData,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    twitter: formData.twitter
                }
            };

            // Remove _id from payload if present to avoid immutable field error (optional but good practice)
            delete payload._id;

            const headers = {
                'Authorization': localStorage.getItem('token') || ''
            };

            if (formData._id) {
                await axios.put(`/api/profile/${formData._id}`, payload, { headers });
            } else {
                // Handle create if needed, though we assume one profile exists
                await axios.post('/api/profile', payload, { headers });
            }
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="edit-profile">
            <h2 className="heading">Edit Profile</h2>
            {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="profile-image-section">
                        <div className="image-preview">
                            {formData.image ? (
                                <img src={assetUrl(formData.image)} alt="Profile" />
                            ) : (
                                <div className="placeholder-img">No Image</div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <label className="btn-small upload-btn">
                                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4}></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Contact & Social</h3>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>GitHub</label>
                            <input type="text" name="github" value={formData.github} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Skills Categories</h3>
                    {formData.skills && formData.skills.map((skillGroup: any, categoryIndex: number) => (
                        <div key={categoryIndex} className="experience-edit-block">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Category Name</label>
                                    <input
                                        type="text"
                                        value={skillGroup.category || ''}
                                        onChange={(e) => handleSkillCategoryChange(categoryIndex, 'category', e.target.value)}
                                        placeholder="e.g. Core Stack"
                                    />
                                </div>
                                <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={skillGroup.topPriority || false}
                                            onChange={(e) => handleSkillCategoryChange(categoryIndex, 'topPriority', e.target.checked)}
                                            style={{ width: 'auto' }}
                                        />
                                        Is Top Priority? (Highlights category)
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Skill Items</label>
                                <div className="skills-grid">
                                    {skillGroup.items && skillGroup.items.map((item: string, itemIndex: number) => (
                                        <div key={itemIndex} className="skill-input">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleSkillItemChange(categoryIndex, itemIndex, e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeSkillItem(categoryIndex, itemIndex)} className="btn-icon delete">
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => addSkillItem(categoryIndex)} className="btn-small mt-2" style={{ marginTop: '10px' }}>
                                    <Plus size={16} /> Add Skill Item
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                                <button type="button" onClick={() => removeSkillCategory(categoryIndex)} className="btn-small btn-icon delete">
                                    <Trash size={16} /> Remove Category
                                </button>
                            </div>
                            <hr style={{ borderColor: 'var(--glass-border)', margin: '15px 0' }} />
                        </div>
                    ))}
                    <button type="button" onClick={addSkillCategory} className="btn-small mt-2">
                        <Plus size={16} /> Add New Category
                    </button>
                </div>

                <div className="form-section">
                    <h3>Experience</h3>
                    {formData.experience.map((exp: any, index: number) => (
                        <div key={index} className="experience-edit-block">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        value={exp.title || ''}
                                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        value={exp.company || ''}
                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                        placeholder="e.g. Tech Corp"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    value={exp.duration || ''}
                                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                    placeholder="e.g. Jan 2020 - Present"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description (Work Done)</label>
                                <textarea
                                    value={exp.description || ''}
                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                    rows={4}
                                    placeholder="Describe your responsibilities and achievements..."
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <button type="button" onClick={() => removeExperience(index)} className="btn-small btn-icon delete">
                                    <Trash size={16} /> Remove Experience
                                </button>
                            </div>
                            <hr style={{ borderColor: 'var(--glass-border)', marginBottom: '15px' }} />
                        </div>
                    ))}
                    <button type="button" onClick={addExperience} className="btn-small">
                        <Plus size={16} /> Add Experience
                    </button>
                </div>

                <button type="submit" className="btn btn-save" disabled={saving}>
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <style>{`
                .form-section {
                    background: rgba(17, 34, 64, 0.5);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border: 1px solid var(--glass-border);
                }
                .form-section h3 {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                    font-size: 1.2rem;
                }
                .profile-image-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .image-preview {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid var(--primary-color);
                    background: var(--bg-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .image-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .placeholder-img {
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                }
                .upload-btn {
                    cursor: pointer;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: var(--text-secondary);
                }
                input, textarea {
                    width: 100%;
                    padding: 10px;
                    background: var(--bg-color);
                    border: 1px solid var(--glass-border);
                    border-radius: 4px;
                    color: var(--text-primary);
                }
                input:focus, textarea:focus {
                    border-color: var(--primary-color);
                    outline: none;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .skill-input {
                    display: flex;
                    gap: 5px;
                }
                .btn-icon {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px;
                }
                .btn-icon.delete {
                    color: #ff6b6b;
                }
                .btn-small {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .btn-save {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                .message {
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                }
                .message.success {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-color);
                }
                .message.error {
                    background: rgba(255, 107, 107, 0.1);
                    color: #ff6b6b;
                }
                @media (max-width: 768px) {
                    .grid-2 {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default EditProfile;
