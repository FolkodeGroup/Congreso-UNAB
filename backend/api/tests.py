from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Disertante

class DisertanteViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.disertante_data = {'nombre': 'Test Disertante', 'bio': 'Test Bio', 'foto_url': ''}
        self.disertante = Disertante.objects.create(**self.disertante_data)
        self.list_url = reverse('disertante-list')
        self.detail_url = reverse('disertante-detail', kwargs={'pk': self.disertante.pk})

    def test_list_disertantes(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nombre'], self.disertante_data['nombre'])

    def test_retrieve_disertante(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], self.disertante_data['nombre'])