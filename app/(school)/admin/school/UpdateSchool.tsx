import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { stringToHslColor } from '@/lib/utils';
import { UPDATE_SCHOOL } from './SchoolDetailService';

// Define the valid school types based on your GraphQL schema
const SCHOOL_TYPES = [
  'GOVERNMENT',
  'GOVERNMENT_AIDED',
  'PRIVATE',
  'NATIONAL',
  'INTERNATIONAL',
  'OTHER'
];

// Define the valid board types based on your GraphQL schema
const BOARD_TYPES = ['STATE', 'CBSE', 'ICSE', 'IGCSE', 'OTHER'];

function UpdateSchool({ schoolData, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: schoolData.name || '',
    type: schoolData.type || '',
    board: schoolData.board || '',
    city: schoolData.city || '',
    country: schoolData.country || '',
    contactNumber: schoolData.contactNumber || '',
    contactEmail: schoolData.contactEmail || '',
    subdomain: schoolData.subdomain || '',
    timezone: schoolData.timezone || '',
    caption: schoolData.caption || ''
  });

  const [updateSchool] = useMutation(UPDATE_SCHOOL);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare the variables for the mutation
      const variables = {
        schoolId: schoolData.id,
        name: formData.name,
        // Only include type and board if they have valid values
        ...(SCHOOL_TYPES.includes(formData.type) && { type: formData.type }),
        ...(BOARD_TYPES.includes(formData.board) && { board: formData.board }),
        city: formData.city || undefined,
        country: formData.country || undefined,
        contactNumber: formData.contactNumber || undefined,
        contactEmail: formData.contactEmail || undefined,
        subdomain: formData.subdomain || undefined,
        timezone: formData.timezone || undefined,
        caption: formData.caption || undefined
      };

      const { data } = await updateSchool({ variables });

      if (data.updateSchool.error) {
        throw new Error(data.updateSchool.error);
      }
      await refetch();
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'School details updated successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update school details: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <>
          <TableRow>
            <TableCell className="font-medium">Name</TableCell>
            <TableCell>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Type</TableCell>
            <TableCell>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Board</TableCell>
            <TableCell>
              <Select
                name="board"
                value={formData.board}
                onValueChange={(value) => handleSelectChange('board', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {BOARD_TYPES.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">City</TableCell>
            <TableCell>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Country</TableCell>
            <TableCell>
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contact Number</TableCell>
            <TableCell>
              <Input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contact Email</TableCell>
            <TableCell>
              <Input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">School Domain</TableCell>
            <TableCell>
              <Input
                name="subdomain"
                value={formData.subdomain}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Timezone</TableCell>
            <TableCell>
              <Input
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Caption</TableCell>
            <TableCell>
              <Input
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
              />
            </TableCell>
          </TableRow>
        </>
      );
    } else {
      return (
        <>
          <TableRow>
            <TableCell className="font-medium">Name</TableCell>
            <TableCell>{schoolData.name || ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Type</TableCell>
            <TableCell>{schoolData.type || ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Board</TableCell>
            <TableCell>{schoolData.board || ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">City</TableCell>
            <TableCell>{schoolData.city}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Country</TableCell>
            <TableCell>{schoolData.country}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contact Number</TableCell>
            <TableCell>{schoolData.contactNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contact Email</TableCell>
            <TableCell>{schoolData.contactEmail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">School Domain</TableCell>
            <TableCell>
              {schoolData.subdomain ? `${schoolData.subdomain}.all.school` : ''}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Timezone</TableCell>
            <TableCell>{schoolData.timezone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Caption</TableCell>
            <TableCell>{schoolData.caption}</TableCell>
          </TableRow>
        </>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">School info</h3>
        <Button
          onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {renderContent()}
            <TableRow>
              <TableCell className="font-medium">Head Teacher</TableCell>
              <TableCell>
                {schoolData.headTeacher && (
                  <div className="flex items-center">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage
                        src={schoolData.headTeacher.profilePicture?.signedUrl}
                      />
                      <AvatarFallback
                        style={{
                          backgroundColor: stringToHslColor(
                            `${schoolData.headTeacher.firstName} ${schoolData.headTeacher.lastName}`,
                            50,
                            60
                          )
                        }}
                      >
                        {schoolData.headTeacher.firstName
                          .charAt(0)
                          .toUpperCase()}
                        {schoolData.headTeacher.lastName
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {schoolData.headTeacher.firstName}{' '}
                      {schoolData.headTeacher.lastName}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default UpdateSchool;
