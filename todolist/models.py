from django.db import models

class TodoItem(models.Model):
	description = models.CharField(max_length=50)
	status = models.CharField(max_length=50)

	def __unicode__(self):
		return self.description

	def get_values(self):
		values = {}
		values['description'] = self.description
		values['status'] = self.status
		values['id'] = self.id
		return values

	def set_values(self,values):
		self.description = values['description']
		self.status = values['status'] 
		self.save()
