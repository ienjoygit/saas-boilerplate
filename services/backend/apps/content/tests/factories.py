import factory

from .. import models


class ContentfulDemoItemFactory(factory.DjangoModelFactory):
    id = factory.Faker('uuid4')
    fields = {}
    is_published = True

    class Meta:
        model = models.DemoItem
